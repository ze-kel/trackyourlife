import type { IColorValue, INumberSettings } from "@t/trackable";
import { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ArrayElement } from "@t/helpers";
import ColorPicker from "@components/_UI/ColorPicker";
import { presetsMap } from "@components/_UI/ColorPicker/presets";
import { range } from "src/helpers/animation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InterpolateColors, makeColorString } from "src/helpers/colorTools";
import { ColorDisplay } from "@components/_UI/ColorPicker/presetsPanel";
import { useTheme } from "next-themes";

type IColorCodingValue = INumberSettings["colorCoding"];

type IColorCodingItem = ArrayElement<NonNullable<IColorCodingValue>>;

export interface INumberColorSelector {
  initialValue: IColorCodingValue;
  onChange: (a: IColorCodingValue) => void;
}

const makeGradient = (
  values: IColorCodingItem[],
  min: number,
  max: number,
  theme = "dark",
) => {
  if (!values.length) return "";

  if (values.length === 1 && values[0])
    return `linear-gradient(in srgb to right, ${makeColorString(
      theme === "light" ? values[0].color.lightMode : values[0].color.darkMode,
    )} 0%, ${makeColorString(
      theme === "light" ? values[0].color.lightMode : values[0].color.darkMode,
    )} 100%`;

  return `linear-gradient(in srgb to right, ${values
    .map(
      (v) =>
        makeColorString(
          theme === "light" ? v.color.lightMode : v.color.darkMode,
        ) +
        " " +
        range(min, max, 0, 100, v.point) +
        "%",
    )
    .join(", ")})`;
};

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

const getColorAtPosition = ({
  value,
  point,
}: {
  value: IColorCodingItem[];
  point: number;
}): IColorValue => {
  console.log(value);
  if (!value.length) return presetsMap.neutral;
  if (value.length === 1 && value[0]) return value[0].color;

  let leftSide: IColorCodingItem | undefined = undefined;
  let rightSide: IColorCodingItem | undefined = undefined;

  for (const v of value) {
    if (!leftSide || (leftSide && v.point <= point)) {
      leftSide = v;
    }
    if (!rightSide && v.point >= point) {
      rightSide = v;
    }
  }

  if (!leftSide && rightSide) return rightSide.color;
  if (!rightSide && leftSide) return leftSide.color;

  if (!leftSide || !rightSide) return presetsMap.neutral;

  const proportion = range(leftSide.point, rightSide.point, 0, 1, point);

  return {
    lightMode: InterpolateColors(
      leftSide.color.lightMode,
      rightSide.color.lightMode,
      proportion,
    ),
    darkMode: InterpolateColors(
      leftSide.color.darkMode,
      rightSide.color.darkMode,
      proportion,
    ),
  };
};

const ControllerGradient = ({
  value,
  onChange,
}: {
  value: IColorCodingItem[];
  onChange: (v: IColorCodingItem[]) => void;
}) => {
  const controllerRef = useRef<HTMLDivElement>(null);

  const [minInput, setMinInput] = useState<number | null>(
    getActualMin(value[0]?.point, null),
  );
  const [maxInput, setMaxInput] = useState<number | null>(
    getActualMax(value[value.length - 1]?.point, null),
  );

  const actualMin = getActualMin(value[0]?.point, minInput);
  const actualMax = getActualMax(value[value.length - 1]?.point, maxInput);

  const setById = (id: string, point: number) => {
    const newValue = [...value];
    const i = value.findIndex((v) => v.id === id);
    const a = newValue[i];
    if (!a) return;
    a.point = point;
    onChange(newValue);
  };

  const addColor = (e: React.MouseEvent) => {
    if (!controllerRef.current) return;
    const newVal = [...value];

    const { width, left } = controllerRef.current.getBoundingClientRect();

    const coordinate = e.clientX - left;
    const point = Math.round(range(0, width, actualMin, actualMax, coordinate));

    const color = getColorAtPosition({ value, point });
    const id = uuidv4();

    newVal.push({ point, color, id });
    onChange(newVal);
    setSelectedColor(id);
  };

  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (e: React.MouseEvent, id: string) => {
    setSelectedColor(id);
    if (!controllerRef.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;

    const { width, left, top, height } =
      controllerRef.current.getBoundingClientRect();

    const moveHadler = (e: MouseEvent) => {
      setIsDragging(true);
      e.preventDefault();
      const position = Math.round(
        range(0, width, actualMin, actualMax, e.clientX - left),
      );

      const vertical = e.clientY - top - height / 2;

      if (Math.abs(vertical) > height * 1.5) {
        setSelectedColorRemove(Math.abs(vertical) === vertical ? 1 : -1);
      } else {
        setSelectedColorRemove(0);
      }

      setById(id, position);
    };

    const upHandler = (e: MouseEvent) => {
      setIsDragging(false);
      removeEventListener("mousemove", moveHadler);
      removeEventListener("mouseup", upHandler);

      if (!controllerRef.current) return;

      const { top, height } = controllerRef.current.getBoundingClientRect();

      const vertical = e.clientY - top - height / 2;

      if (Math.abs(vertical) > height * 1.5) {
        const newVal = [...value].filter((v) => v.id !== id);
        setSelectedColor(newVal[0]?.id || "");
        onChange(newVal);
      }
      setSelectedColorRemove(0);
    };

    addEventListener("mousemove", moveHadler);
    addEventListener("mouseup", upHandler);
  };

  const setInputsToActual = () => {
    setMinInput(actualMin);
    setMaxInput(actualMax);
  };

  const [selectedColor, setSelectedColor] = useState(value[0]?.id || "");

  const selectedColorIndex = useMemo(() => {
    return value.findIndex((v) => v.id === selectedColor);
  }, [selectedColor, value]);

  const selectedColorObject = value[selectedColorIndex]?.color;

  const [selectedColorRemove, setSelectedColorRemove] = useState<0 | -1 | 1>(0);

  const updateSelectedColor = (color: IColorValue) => {
    const newVal = [...value];
    const v = value[selectedColorIndex];
    if (!v) throw new Error("No value[selectedColorIndex]");

    value[selectedColorIndex] = { ...v, color };
    onChange(newVal);
  };

  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="flex gap-2">
        {isDragging && (
          <div
            className={cn(
              "absolute z-50 h-[200%] w-full -translate-y-1/2 ",
              selectedColorRemove === 0 ? "cursor-grabbing" : "cursor-default",
            )}
          ></div>
        )}
        <Input
          error={actualMin !== minInput}
          value={minInput === null ? "" : minInput}
          type="number"
          onBlur={setInputsToActual}
          onChange={(e) => {
            setMinInput(
              Number.isNaN(e.target.valueAsNumber)
                ? null
                : e.target.valueAsNumber,
            );
          }}
          className="w-16"
        />
        <div
          ref={controllerRef}
          className="relative box-border flex h-9 w-full cursor-copy overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
          style={{
            background: makeGradient(
              value,
              actualMin,
              actualMax,
              resolvedTheme,
            ),
          }}
          onClick={addColor}
        >
          <div>
            {value.map((v) => {
              return (
                <div
                  key={v.id}
                  onMouseDown={(e) => startDrag(e, v.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-0 h-full w-4 cursor-grab  rounded-sm border border-black transition-transform"
                  style={{
                    left: range(actualMin, actualMax, 0, 100, v.point) + "%",
                    transform: `translateX(-50%) translateY(${
                      v.id === selectedColor ? selectedColorRemove * 66 : 0
                    }%)`,
                  }}
                >
                  <ColorDisplay
                    color={v.color}
                    className={cn(
                      "h-full rounded-sm border",
                      v.id === selectedColor && "dark:border-white",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <Input
          error={actualMax !== maxInput}
          value={maxInput === null ? "" : maxInput}
          type="number"
          onBlur={setInputsToActual}
          onChange={(e) => {
            setMaxInput(
              Number.isNaN(e.target.valueAsNumber)
                ? null
                : e.target.valueAsNumber,
            );
          }}
          className="w-16"
        />
      </div>

      <div>
        {selectedColorObject ? (
          <ColorPicker
            value={selectedColorObject}
            onChange={updateSelectedColor}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

const NumberColorSelector = ({
  initialValue,
  onChange,
}: INumberColorSelector) => {
  const [value, updateValue] = useState<IColorCodingItem[]>(
    initialValue || [
      { point: 0, color: presetsMap.red, id: uuidv4() },
      { point: 100, color: presetsMap.green, id: uuidv4() },
    ],
  );

  const sorted = value.sort((a, b) => a.point - b.point);

  return (
    <div className="flex flex-col gap-2">
      <ControllerGradient value={sorted} onChange={updateValue} />
    </div>
  );
};

export default NumberColorSelector;
