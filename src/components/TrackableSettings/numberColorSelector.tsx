import type { IColor, IColorValue, INumberSettings } from "@t/trackable";
import cloneDeep from "lodash/cloneDeep";
import { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ArrayElement } from "@t/helpers";
import ColorPicker, {
  ColorDisplay,
  makeColorString,
} from "@components/_UI/ColorPicker";
import { presetsMap } from "@components/_UI/ColorPicker/presets";
import { range } from "src/helpers/animation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const addIds = (value: IColorCodingValue = []) => {
  const v2 = cloneDeep(value);

  v2.forEach((item) => {
    if (!item.id) {
      item.id = uuidv4();
    }
  });
  return v2;
};

type IColorCodingValue = INumberSettings["colorCoding"];

type IColorCodingItem = ArrayElement<NonNullable<IColorCodingValue>>;

export interface INumberColorSelector {
  initialValue: IColorCodingValue;
  onChange: (a: IColorCodingValue) => void;
}

const makeGradient = (values: IColorCodingItem[], min: number, max: number) => {
  if (!values.length) return "";

  return `linear-gradient(to right, ${values
    .map(
      (v) =>
        makeColorString(v.color.darkMode) +
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

const ControllerGradient = ({
  value,
  update,
}: {
  value: IColorCodingItem[];
  update: (v: IColorCodingItem[]) => void;
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
    update(newValue);
  };

  const addColor = (e: MouseEvent) => {
    if (!controllerRef.current) return;
    const newVal = [...value];

    const { width, left } = controllerRef.current.getBoundingClientRect();

    const coordinate = e.clientX - left;
    const position = Math.round(
      range(0, width, actualMin, actualMax, coordinate),
    );

    newVal.push({ point: position, color: presetsMap.neutral, id: uuidv4() });
    update(newVal);
  };

  const startDrag = (e: React.MouseEvent, id: string) => {
    if (!controllerRef.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;

    const { width, left } = controllerRef.current.getBoundingClientRect();

    const moveHadler = (e: MouseEvent) => {
      const position = Math.round(
        range(0, width, actualMin, actualMax, e.clientX - left),
      );
      setById(id, position);
    };

    //moveHadler(e as unknown as MouseEvent);

    const upHandler = () => {
      removeEventListener("mousemove", moveHadler);
      removeEventListener("mouseup", upHandler);
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

  const updateSelectedColor = (color: IColorValue) => {
    const newVal = [...value];
    const v = value[selectedColorIndex];
    if (!v) throw new Error("No value[selectedColorIndex]");

    value[selectedColorIndex] = { ...v, color };
    update(newVal);
  };

  return (
    <>
      <div className="flex gap-2">
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
          className="relative box-border flex h-9 w-full rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
          style={{ background: makeGradient(value, actualMin, actualMax) }}
          onClick={addColor}
        >
          <div>
            {value.map((v) => {
              return (
                <div
                  key={v.id}
                  onMouseDown={(e) => startDrag(e, v.id as string)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(v.id as string);
                  }}
                  className="absolute top-0 h-full w-4"
                  style={{
                    left: range(actualMin, actualMax, 0, 100, v.point) + "%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <ColorDisplay
                    color={v.color}
                    className={cn(
                      "h-full",
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
        {
          <ColorPicker
            value={value[selectedColorIndex]?.color}
            onChange={updateSelectedColor}
          />
        }
      </div>
    </>
  );
};

const NumberColorSelector = ({
  initialValue,
  onChange,
}: INumberColorSelector) => {
  const [value, updateValue] = useState<IColorCodingItem[]>(
    addIds(
      initialValue || [
        { point: 0, color: presetsMap.red },
        { point: 100, color: presetsMap.green },
      ],
    ),
  );
  const sorted = value.sort((a, b) => a.point - b.point);

  return (
    <div className="flex flex-col gap-2">
      <ControllerGradient value={sorted} update={updateValue} />
    </div>
  );
};

export default NumberColorSelector;
