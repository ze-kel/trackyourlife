import type { CSSProperties, TouchEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@shad/utils";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";

import type { IColorCodingValue, IColorValue } from "@tyl/validators/trackable";
import { clamp } from "@tyl/helpers";
import { range } from "@tyl/helpers/animation";
import { presetsMap } from "@tyl/helpers/colorPresets";
import {
  getColorAtPosition,
  makeColorString,
  makeCssGradient,
} from "@tyl/helpers/colorTools";

import { Button } from "~/@shad/components/button";
import { Input } from "~/@shad/components/input";
import ColorPicker, { BetterNumberInput } from "~/components/Colors";
import { ColorDisplay } from "~/components/Colors/colorDisplay";
import { useRefSize } from "~/components/Colors/contoller";
import { useIsMobile } from "~/utils/useIsDesktop";
import style from "./numberColorSelector.module.css";

const getActualMin = (
  firstVal: number | undefined,
  minInput: number | null,
) => {
  if (typeof firstVal !== "number" && typeof minInput !== "number") return 0;

  const a = typeof firstVal === "number" ? firstVal : Infinity;
  const b = typeof minInput === "number" ? minInput : Infinity;
  return Math.min(a, b);
};
const getActualMax = (
  firstVal: number | undefined,
  maxInput: number | null,
) => {
  if (typeof firstVal !== "number" && typeof maxInput !== "number") return 100;

  const a = typeof firstVal === "number" ? firstVal : -Infinity;
  const b = typeof maxInput === "number" ? maxInput : -Infinity;
  return Math.max(a, b);
};

// This can and probably should be refactored and be somewhat unified with a similar controller in color selector
const ControllerGradient = ({
  value,
  onChange,
}: {
  value: IColorCodingValue[];
  onChange: (v: IColorCodingValue[]) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const firstItem = value[0];
  const lastItem = value[value.length - 1];

  const { width, dataRef } = useRefSize(ref);

  const [minValue, setMinValue] = useState<number>(
    getActualMin(value[0]?.point, 0),
  );
  const [maxValue, setMaxValue] = useState<number>(
    getActualMax(value[value.length - 1]?.point, 100),
  );

  const [minInput, setMinInput] = useState(String(minValue));
  const [maxInput, setMaxInput] = useState(String(maxValue));

  const setById = (id: string, point: number) => {
    const newValue = [...value];
    const a = newValue.find((v) => v.id === id);
    if (!a) return;
    a.point = point;
    onChange(newValue);
  };

  const addColor = (e?: React.MouseEvent) => {
    let point = 50;

    if (e) {
      if (!ref.current) return;

      const { width, left } = dataRef.current;
      const coordinate = e.clientX - left;
      point = Math.round(range(0, width, minValue, maxValue, coordinate));
    }

    const newVal = [...value];
    const color = getColorAtPosition({ value, point });
    const id = uuidv4();

    newVal.push({ point, color, id });
    onChange(newVal);
    setSelectedColor(id);
  };

  const [isDragging, setIsDragging] = useState(false);

  const move = (id: string, clientX: number, clientY: number) => {
    const { width, left, top, height } = dataRef.current;
    setIsDragging(true);
    const position = Math.round(
      range(0, width, minValue, maxValue, clientX - left),
    );

    const vertical = clientY - top - height / 2;

    if (Math.abs(vertical) > height * 1.5) {
      setSelectedColorRemove(Math.abs(vertical) === vertical ? 1 : -1);
    } else {
      setSelectedColorRemove(0);
    }

    setById(id, position);
  };

  const up = (id: string, clientY: number) => {
    setIsDragging(false);

    const { top, height } = dataRef.current;

    const vertical = clientY - top - height / 2;

    if (Math.abs(vertical) > height * 1.5 && value.length > 1) {
      removeColor(id);
    }
    setSelectedColorRemove(0);
  };

  const startMouseDrag = (e: React.MouseEvent, id: string) => {
    // Left click only
    if (e.nativeEvent.button !== 0) return;

    setSelectedColor(id);

    const moveHandler = (e: MouseEvent) => {
      e.preventDefault();
      move(id, e.clientX, e.clientY);
    };

    const upHandler = (e: MouseEvent) => {
      up(id, e.clientY);
      removeEventListener("mousemove", moveHandler);
      removeEventListener("mouseup", upHandler);
    };

    addEventListener("mousemove", moveHandler);
    addEventListener("mouseup", upHandler);
    addEventListener("mouseleave", upHandler);
  };

  const startTouch = (e: TouchEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(id);
  };

  const touchMove = (e: TouchEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const t = e.touches[0];
    if (t) {
      move(id, t.clientX, t.clientY);
    }
  };

  const touchEnd = (e: TouchEvent, id: string) => {
    const t = e.touches[0];
    if (t) {
      up(id, t.clientY);
    }
  };

  const removeColor = (id: string) => {
    const newVal = [...value].filter((v) => v.id !== id);
    setSelectedColor(newVal[0]?.id ?? "");
    onChange(newVal);
  };

  const minMaxInputBlur = () => {
    setMinInput(String(minValue));
    setMaxInput(String(maxValue));
    const r = [...value];

    r.forEach((v) => {
      v.point = clamp(v.point, minValue, maxValue);
    });

    onChange(r);
  };

  const [selectedColor, setSelectedColor] = useState(value[0]?.id ?? "");

  const selectedColorIndex = useMemo(() => {
    return value.findIndex((v) => v.id === selectedColor);
  }, [selectedColor, value]);

  const selectedColorObject = value[selectedColorIndex]?.color;

  const [selectedColorRemove, setSelectedColorRemove] = useState<0 | -1 | 1>(0);

  const updateSelectedColor = (color: IColorValue) => {
    const newVal = [...value];
    const v = newVal[selectedColorIndex];
    if (!v) throw new Error("No value[selectedColorIndex]");
    newVal[selectedColorIndex] = { ...v, color };

    onChange(newVal);
  };

  const { resolvedTheme } = useTheme();

  return (
    <>
      <div
        className="flex touch-pan-y items-stretch gap-2"
        onTouchStart={(e) => e.preventDefault()}
        style={
          {
            "--gradLight": makeCssGradient(value, minValue, maxValue, "light"),
            "--gradDark": makeCssGradient(value, minValue, maxValue, "dark"),
          } as CSSProperties
        }
      >
        <Input
          warning={firstItem ? minValue > firstItem.point : false}
          error={minInput !== String(minValue)}
          value={minInput}
          type="number"
          onBlur={minMaxInputBlur}
          onChange={(e) => {
            setMinInput(e.target.value);
            const n = e.target.valueAsNumber;
            if (Number.isNaN(n)) return;
            setMinValue(Math.min(n, maxValue - 1));
          }}
          className="w-16 text-center max-sm:w-12 max-sm:p-0"
        />
        <div
          className={cn(
            style.gradientFromDarkVar,
            "",
            "relative box-border flex min-h-9 w-full rounded-lg border-2 border-neutral-200 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800",
            !isDragging && "cursor-copy",
          )}
          onClick={(e) => {
            if (!isDragging) {
              addColor(e);
            }
          }}
        >
          <div ref={ref} className="relative w-full">
            {value.map((v) => {
              return (
                <div
                  key={v.id}
                  className={cn(
                    "absolute top-1/2 h-[125%] cursor-grab touch-none rounded-lg border-2 border-transparent transition-[height] transition-[opacity]",
                    v.id === selectedColor &&
                      "z-20 border-neutral-50 dark:border-neutral-950",
                    v.id === selectedColor &&
                      value.length > 1 &&
                      selectedColorRemove !== 0 &&
                      "h-[100%] opacity-25",
                  )}
                  style={{
                    // This is fallback for SSR where we cant get width and therefore cant do Translate()
                    left: width
                      ? 0
                      : range(minValue, maxValue, 0, 100, v.point) + "%",
                    transform: `${
                      width
                        ? `translateX(calc(-50% + ${
                            width * range(minValue, maxValue, 0, 1, v.point)
                          }px))`
                        : "translateX(-50%)"
                    } translateY(-50%)`,
                  }}
                >
                  <div
                    onTouchStart={(e) => startTouch(e, v.id)}
                    onTouchMove={(e) => touchMove(e, v.id)}
                    onTouchEnd={(e) => touchEnd(e, v.id)}
                    onTouchCancel={(e) => touchEnd(e, v.id)}
                    onMouseDown={(e) => startMouseDrag(e, v.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 select-none bg-red-500 opacity-0 max-sm:w-[200%]"
                  ></div>
                  <div
                    className={cn(
                      "h-full overflow-hidden rounded-md border-2",
                      v.id === selectedColor
                        ? "border-neutral-950 dark:border-neutral-50"
                        : "border-neutral-500 dark:border-neutral-500",
                      v.point !== clamp(v.point, minValue, maxValue) &&
                        "border-orange-500 dark:border-orange-600",
                    )}
                  >
                    <div
                      className={cn(
                        "h-full w-1.5 transition-all",
                        v.id === selectedColor &&
                          value.length > 1 &&
                          selectedColorRemove !== 0 &&
                          "w-0.5",
                      )}
                      // We don't know whether user has darkmode on ssr
                      suppressHydrationWarning
                      style={{
                        background: makeColorString(
                          resolvedTheme === "dark"
                            ? v.color.darkMode
                            : v.color.lightMode,
                        ),
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="justify-self-end">
          <Input
            warning={lastItem ? lastItem.point > maxValue : false}
            error={maxInput !== String(maxValue)}
            value={maxInput}
            type="number"
            onBlur={minMaxInputBlur}
            onChange={(e) => {
              setMaxInput(e.target.value);
              const n = e.target.valueAsNumber;
              if (Number.isNaN(n)) return;
              setMaxValue(Math.max(n, minValue + 1));
            }}
            className="w-16 text-center max-sm:w-12 max-sm:p-0"
          />
        </div>
      </div>
      <div className="mt-2 flex flex-col-reverse gap-4 sm:flex-row">
        <div className="w-full max-md:hidden">
          {!isMobile && selectedColorObject && (
            <ColorPicker
              value={selectedColorObject}
              onChange={updateSelectedColor}
            />
          )}
        </div>
        <div className="w-full sm:max-w-xs">
          <div className="flex h-fit flex-col gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {value.map((v) => (
              <div
                key={v.id}
                className={cn(
                  "flex gap-2 p-2 transition-all",
                  v.id === selectedColor
                    ? "rounded-md bg-neutral-50 shadow dark:bg-neutral-950 dark:shadow-none"
                    : "cursor-pointer",
                )}
                onClick={() => setSelectedColor(v.id)}
              >
                <ColorDisplay color={v.color} />
                <BetterNumberInput
                  value={v.point}
                  limits={{ min: minValue, max: maxValue }}
                  onChange={(val) => setById(v.id, val)}
                />
                <Button
                  disabled={value.length < 2}
                  variant={"ghost"}
                  size={"icon"}
                  className="flex-shrink-0"
                >
                  <XIcon
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColor(v.id);
                    }}
                  />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => addColor()}
          >
            <PlusCircleIcon size={16} className="mr-2 opacity-50" />
            Add color
          </Button>
        </div>
      </div>
    </>
  );
};

const NumberColorSelector = ({
  value,
  onChange,
}: {
  value: IColorCodingValue[];
  onChange: (v: NonNullable<IColorCodingValue[]>) => void;
}) => {
  const [innerValue, setInnerValue] = useState(
    value.length
      ? value
      : [
          { point: 0, color: presetsMap.red, id: uuidv4() },
          { point: 100, color: presetsMap.green, id: uuidv4() },
        ],
  );

  const sorted = innerValue.sort((a, b) => a.point - b.point);

  return (
    <ControllerGradient
      value={sorted}
      onChange={(v) => {
        setInnerValue(v);
        onChange(v);
      }}
    />
  );
};

export default NumberColorSelector;
