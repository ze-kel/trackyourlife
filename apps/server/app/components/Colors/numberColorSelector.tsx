import type { TouchEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@shad/utils";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";

import type { IColorCodingValue, IColorValue } from "@tyl/validators/trackable";
import { clamp } from "@tyl/helpers";
import { range } from "@tyl/helpers/animation";
import { presetsMap } from "@tyl/helpers/colorPresets";
import { getColorAtPosition, makeCssGradient } from "@tyl/helpers/colorTools";

import { Button } from "~/@shad/components/button";
import { Input } from "~/@shad/components/input";
import { Label } from "~/@shad/components/label";
import { RadioTabItem, RadioTabs } from "~/@shad/components/radio-tabs";
import { Switch } from "~/@shad/components/switch";
import ColorPicker, { BetterNumberInput } from "~/components/Colors";
import { ColorDisplay } from "~/components/Colors/colorDisplay";
import { useRefSize } from "~/components/Colors/contoller";

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

const ControllerGradient = ({
  value,
  onChange,
}: {
  value: IColorCodingValue[];
  onChange: (v: IColorCodingValue[]) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

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
  };

  const startTouch = (id: string) => {
    setSelectedColor(id);
  };

  const touchMove = (e: TouchEvent, id: string) => {
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

  const { resolvedTheme: theme } = useTheme();
  const [gradientPreviewTheme, setGradientPreviewTheme] = useState("dark");

  useEffect(() => {
    setGradientPreviewTheme(theme ?? "");
  }, [theme]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[min-content_1fr_min-content_min-content]">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {isDragging && false && (
          <div
            className={cn(
              "absolute z-50 h-[200%] w-full -translate-y-1/2",
              selectedColorRemove === 0
                ? "cursor-grabbing"
                : value.length > 1
                  ? "cursor-default"
                  : "cursor-not-allowed",
            )}
          ></div>
        )}
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
          className="w-16"
        />
        <div
          className={cn(
            "relative box-border flex h-9 w-full rounded-lg border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 max-sm:col-span-full max-sm:row-start-2 max-sm:row-end-2",
            !isDragging && "cursor-copy",
          )}
          style={{
            background: makeCssGradient(
              value,
              minValue,
              maxValue,
              gradientPreviewTheme,
            ),
          }}
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
                  onTouchStart={() => startTouch(v.id)}
                  onTouchMove={(e) => touchMove(e, v.id)}
                  onTouchEnd={(e) => touchEnd(e, v.id)}
                  onMouseDown={(e) => startMouseDrag(e, v.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={cn(
                    "absolute top-1/2 h-[125%] cursor-grab touch-none overflow-hidden rounded-lg border-2 border-transparent",
                    v.id === selectedColor &&
                      "z-20 border-neutral-50 dark:border-neutral-950",
                    v.id === selectedColor &&
                      value.length > 1 &&
                      selectedColorRemove !== 0 &&
                      "opacity-25",
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
                    className={cn(
                      "h-full overflow-hidden rounded-md border-2 shadow-lg shadow-neutral-50",
                      v.id === selectedColor
                        ? "border-neutral-950 dark:border-neutral-50"
                        : "border-neutral-500 dark:border-neutral-500",
                      v.point !== clamp(v.point, minValue, maxValue) &&
                        "border-orange-500 dark:border-orange-600",
                    )}
                  >
                    <ColorDisplay
                      color={v.color}
                      className={cn(
                        "box-border h-full w-2 overflow-hidden rounded-md border max-sm:w-4",
                      )}
                    />
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
            className="w-16"
          />
        </div>
        <RadioTabs
          suppressHydrationWarning={true}
          value={gradientPreviewTheme}
          onValueChange={setGradientPreviewTheme}
          className="max-sm:col-span-full max-sm:row-start-1 max-sm:row-end-1"
        >
          <RadioTabItem
            suppressHydrationWarning={true}
            value="light"
            className="w-full"
          >
            Light
          </RadioTabItem>
          <RadioTabItem
            suppressHydrationWarning={true}
            value="dark"
            className="w-full"
          >
            Dark
          </RadioTabItem>
        </RadioTabs>
      </div>
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        <div className="w-full">
          {selectedColorObject && (
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
  enabled,
  onEnabledChange,
  value,
  onChange,
}: {
  enabled?: boolean;
  onEnabledChange: (v: boolean) => void;
  value: IColorCodingValue[];
  onChange: (v: NonNullable<IColorCodingValue[]>) => void;
}) => {
  const [innerEnabled, setInnerEnabled] = useState(enabled ?? false);
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
    <div className="flex flex-col gap-2">
      <div className="mt-1 flex items-center space-x-2">
        <Switch
          id="color-coding"
          checked={innerEnabled}
          onCheckedChange={(v) => {
            setInnerEnabled(v);
            onEnabledChange(v);
            onChange(innerValue);
          }}
        />
        <Label htmlFor="color-coding">Use color coding</Label>
      </div>

      {innerEnabled && (
        <ControllerGradient
          value={sorted}
          onChange={(v) => {
            setInnerValue(v);
            onChange(v);
          }}
        />
      )}
    </div>
  );
};

export default NumberColorSelector;
