import { Fragment, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

import type {
  IColorHSL,
  IColorRGB,
  IColorValue,
} from "@tyl/validators/trackable";
import { clamp } from "@tyl/helpers/animation";
import {
  findClosestDarkmode,
  findClosestLightmode,
  HSLToRGB,
  makeColorString,
  RGBToHSL,
} from "@tyl/helpers/colorTools";

import { Input } from "~/@shad/components/input";
import { RadioTabItem, RadioTabs } from "~/@shad/components/radio-tabs";
import { Switch } from "~/@shad/components/switch";
import { cn } from "~/@shad/utils";
import { Controller, Controller2D } from "./contoller";

export const BetterNumberInput = ({
  value,
  onChange,
  limits = { min: 0, max: 255 },
  className,
  hardLimits = false,
}: {
  value: number;
  limits?: { min: number; max: number };
  onChange: (v: number) => void;
  className?: string;
  hardLimits?: boolean;
}) => {
  const [internalValue, setInternalVal] = useState<number | string>(value);

  useIsomorphicLayoutEffect(() => {
    setInternalVal(value);
  }, [value]);

  const [isError, setIsError] = useState(false);

  return (
    <Input
      className={cn("w-full text-center max-sm:p-0", className)}
      type="number"
      error={isError}
      value={internalValue}
      onChange={(e) => {
        // This code allows input to be empty when editing
        if (Number.isNaN(e.target.valueAsNumber)) {
          setInternalVal("");
          return;
        }

        const clamped = clamp(e.target.valueAsNumber, limits.min, limits.max);

        if (hardLimits) {
          console.log("hardLimits", clamped);
          setInternalVal(clamped);
          onChange(clamped);
          setIsError(false);
        } else {
          console.log("softLimits", e.target.valueAsNumber);
          setInternalVal(e.target.valueAsNumber);

          if (clamped !== e.target.valueAsNumber) {
            setIsError(true);
            return;
          }

          onChange(clamped);
          setIsError(false);
        }
      }}
      onBlur={() => {
        setIsError(false);
        setInternalVal(value);
        if (Number.isNaN(internalValue) || typeof internalValue === "string") {
          return;
        }
        onChange(clamp(internalValue, limits.min, limits.max));
      }}
    />
  );
};

const hueGradient =
  "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)";
const hueGradientDynamic = (s: number, l: number) =>
  `linear-gradient(to right, hsl(0, ${s}%, ${l}%) 0%, hsl(60, ${s}%, ${l}%) 17%, hsl(120, ${s}%, ${l}%)33%, hsl(180, ${s}%, ${l}%) 50%, hsl(240, ${s}%, ${l}%) 67%, hsl(300, ${s}%, ${l}%) 83%, hsl(360, ${s}%, ${l}%) 100%)`;

type IKey = "hue" | "saturation" | "lightness" | "red" | "green" | "blue";

// First color is the controling color, other poins are for displaying derived colors
const DynamicController = ({
  colors,
  setRGB,
  setHSL,
  controlKey,
}: {
  colors: IColorHSL[];
  setRGB: (v: Partial<IColorRGB>) => void;
  setHSL: (v: Partial<IColorHSL>) => void;
  controlKey: IKey;
}) => {
  const rgbArr = colors.map(HSLToRGB);
  if (!rgbArr[0] || !colors[0]) return null;
  const rgb = rgbArr[0];
  const hsl = colors[0];

  switch (controlKey) {
    case "red":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={rgbArr.map((c) => ({ x: c.b, y: c.g }))}
            maxX={255}
            maxY={255}
            onChange={(b, g) => setRGB({ b, g })}
            background={`linear-gradient(to top left, rgb(${rgb.r}, 255, 255), rgba(${rgb.r}, 128, 128, 0), rgb(${rgb.r}, 0, 0)), linear-gradient(to top right, rgb(${rgb.r},255,0), rgba(${rgb.r}, 153, 150, 0), rgb(${rgb.r}, 0, 255)) rgba(${rgb.r}, 153, 150, 1)`}
          />
          <Controller
            key={controlKey}
            values={rgbArr.map((c) => c.r)}
            onChange={(v) => setRGB({ r: Math.round(v) })}
            maxVal={255}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={`linear-gradient(to right, rgb(0,${rgb.g}, ${rgb.b}) 0%, rgb(255,${rgb.g}, ${rgb.b}) 100% )`}
          />
        </Fragment>
      );

    case "green":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={rgbArr.map((c) => ({ x: c.b, y: c.g }))}
            maxX={255}
            maxY={255}
            onChange={(b, g) => setRGB({ b, g })}
            background={`linear-gradient(to bottom right, rgb(0,${rgb.g},0), rgba(128, ${rgb.g}, 128, 0), rgb(255, ${rgb.g}, 255)), linear-gradient(to bottom left, rgb(0, ${rgb.g}, 255), rgba(150, ${rgb.g}, 150, 0), rgb(255, ${rgb.g}, 0)), rgba(150, ${rgb.g}, 150, 1)`}
          />
          <Controller
            key={controlKey}
            values={rgbArr.map((c) => c.g)}
            onChange={(v) => setRGB({ g: v })}
            maxVal={255}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={`linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}) 0%, rgb(${rgb.r}, 255, ${rgb.b}) 100% )`}
          />
        </Fragment>
      );

    case "blue":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={rgbArr.map((c) => ({ x: c.g, y: c.r }))}
            maxX={255}
            maxY={255}
            onChange={(g, r) => setRGB({ g, r })}
            background={`linear-gradient(to bottom right, rgb(0, 0, ${rgb.b}), rgba(128, 128, ${rgb.b}, 0), rgb(255, 255, ${rgb.b})), linear-gradient(to bottom left, rgb(0, 255, ${rgb.b}), rgba(150, 150, ${rgb.b}, 0), rgb(255, 0, ${rgb.b})), rgba(150, 150, ${rgb.b}, 1)`}
          />
          <Controller
            key={controlKey}
            values={rgbArr.map((c) => c.b)}
            onChange={(v) => setRGB({ b: v })}
            maxVal={255}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={`linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0) 0%, rgb(${rgb.r}, ${rgb.g}, 255) 100% )`}
          />
        </Fragment>
      );

    case "hue":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={colors.map((c) => ({ x: c.s, y: c.l }))}
            maxX={100}
            maxY={100}
            onChange={(s, l) => setHSL({ s, l })}
            background={`linear-gradient(to bottom, black 0%, transparent 50%, white 100%), linear-gradient(to right, hsl(${hsl.h}, 0%, 50%) 0%, hsl(${hsl.h}, 100%, 50%) 100%)`}
          />
          <Controller
            values={colors.map((c) => c.h)}
            onChange={(v) => setHSL({ h: v })}
            maxVal={360}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={hueGradient}
          />
        </Fragment>
      );
    case "saturation":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={colors.map((c) => ({ x: c.h, y: c.l }))}
            maxX={360}
            maxY={100}
            onChange={(h, l) => setHSL({ h, l })}
            background={`linear-gradient(to bottom, black 0%, transparent 50%, white 100%), ${hueGradientDynamic(
              hsl.s,
              50,
            )}`}
          />
          <Controller
            values={colors.map((c) => c.s)}
            onChange={(v) => setHSL({ s: v })}
            maxVal={100}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={`linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%) 0%, hsl(${hsl.h}, 100%, ${hsl.l}%) 100% )`}
          />
        </Fragment>
      );

    case "lightness":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            points={colors.map((c) => ({ x: c.h, y: c.s }))}
            maxX={360}
            maxY={100}
            onChange={(h, s) => setHSL({ h, s })}
            background={`
            linear-gradient(to bottom, hsl(0, 0%, ${
              hsl.l
            }%) 0%, transparent 100%), ${hueGradientDynamic(100, hsl.l)}`}
          />
          <Controller
            values={colors.map((c) => c.l)}
            onChange={(v) => setHSL({ l: v })}
            maxVal={100}
            backgroundCurrent={makeColorString(hsl)}
            backgroundScale={`linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%) 0%, hsl(${hsl.h}, ${hsl.s}%, 100%) 100% )`}
          />
        </Fragment>
      );
  }
};

export const PickerRGB = ({
  hsl,
  derived = [],
  onChange,
}: {
  hsl: IColorHSL;
  derived?: IColorHSL[];
  onChange: (v: IColorHSL) => void;
}) => {
  const rgb = HSLToRGB(hsl);

  const setRGB = (vals: Partial<IColorRGB>) => {
    onChange(RGBToHSL({ ...rgb, ...vals }));
  };

  const setHSL = (vals: Partial<IColorHSL>) => {
    onChange({ ...hsl, ...vals });
  };

  const [controlKey, setControlKey] = useState<IKey>("hue");

  const inHSL =
    controlKey === "hue" ||
    controlKey === "saturation" ||
    controlKey === "lightness";

  const bniClasses = "h-7 rounded-b-none border border-b-0 transition-opacity";

  const inactiveClasses = "opacity-70";

  return (
    <div className="grid gap-x-4">
      <div className="flex flex-col gap-2">
        <DynamicController
          colors={[hsl, ...derived]}
          setRGB={setRGB}
          setHSL={setHSL}
          controlKey={controlKey}
        />
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1">
        <BetterNumberInput
          className={cn(bniClasses, inHSL && inactiveClasses)}
          value={rgb.r}
          onChange={(v) => setRGB({ r: clamp(v, 0, 255) })}
          hardLimits
        />
        <BetterNumberInput
          className={cn(bniClasses, inHSL && inactiveClasses)}
          value={rgb.g}
          onChange={(v) => setRGB({ g: clamp(v, 0, 255) })}
          hardLimits
        />
        <BetterNumberInput
          className={cn(bniClasses, inHSL && inactiveClasses)}
          value={rgb.b}
          onChange={(v) => setRGB({ b: clamp(v, 0, 255) })}
          hardLimits
        />
        <BetterNumberInput
          className={cn(bniClasses, !inHSL && inactiveClasses)}
          value={hsl.h}
          limits={{ min: 0, max: 360 }}
          onChange={(v) => setHSL({ h: v })}
          hardLimits
        />
        <BetterNumberInput
          className={cn(bniClasses, !inHSL && inactiveClasses)}
          value={hsl.s}
          limits={{ min: 0, max: 100 }}
          onChange={(v) => setHSL({ s: v })}
          hardLimits
        />
        <BetterNumberInput
          className={cn(bniClasses, !inHSL && inactiveClasses)}
          value={hsl.l}
          limits={{ min: 0, max: 100 }}
          onChange={(v) => setHSL({ l: v })}
          hardLimits
        />
      </div>
      <RadioTabs
        className="grid h-8 grid-cols-6 gap-1 rounded-t-none py-1"
        value={controlKey}
        onValueChange={(v) => setControlKey(v as IKey)}
      >
        <RadioTabItem className="text-xs" value="red">
          R
        </RadioTabItem>
        <RadioTabItem className="text-xs" value="green">
          G
        </RadioTabItem>
        <RadioTabItem className="text-xs" value="blue">
          B
        </RadioTabItem>
        <RadioTabItem className="text-xs" value="hue">
          H
        </RadioTabItem>
        <RadioTabItem className="text-xs" value="saturation">
          S
        </RadioTabItem>
        <RadioTabItem className="text-xs" value="lightness">
          L
        </RadioTabItem>
      </RadioTabs>
    </div>
  );
};

export const ColorPicker = ({
  value,
  onChange,
  className,
}: {
  value: IColorValue;
  onChange: (v: IColorValue) => void;
  className?: string;
}) => {
  const automatic = !value.manualMode;
  const { lightMode, darkMode, userSelect } = value;

  const setLight = (lightMode: IColorHSL) => {
    onChange({ darkMode, lightMode, userSelect: lightMode, manualMode: true });
  };

  const setDark = (darkMode: IColorHSL) => {
    onChange({ darkMode, lightMode, userSelect: darkMode, manualMode: true });
  };

  const setBoth = (color: IColorHSL) => {
    onChange({
      darkMode: findClosestDarkmode(color),
      lightMode: findClosestLightmode(color),
      userSelect: color,
      manualMode: false,
    });
  };

  const [mode, setMode] = useState("light");

  return (
    <div className={className}>
      <m.div
        className={cn(
          "mb-2 flex min-h-10 w-fit items-center gap-2 overflow-hidden rounded-lg bg-neutral-100 px-2 text-xs dark:bg-neutral-900",
        )}
      >
        <Switch
          checked={automatic}
          onCheckedChange={(v) => {
            onChange({ ...value, userSelect: lightMode, manualMode: !v });
          }}
        />
        <span>Auto Contrast</span>

        <AnimatePresence initial={false}>
          {!automatic && (
            <m.div
              transition={{ duration: 0.33, ease: "easeOut" }}
              layout
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "auto",
                opacity: 1,
              }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <RadioTabs
                value={mode}
                onValueChange={setMode}
                className="h-full bg-transparent p-0.5"
              >
                <RadioTabItem className="w-fit" value="light">
                  Light
                </RadioTabItem>
                <RadioTabItem className="w-fit" value="dark">
                  Dark
                </RadioTabItem>
              </RadioTabs>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      {automatic ? (
        <PickerRGB
          hsl={userSelect}
          derived={[lightMode, darkMode]}
          onChange={setBoth}
        />
      ) : mode === "light" ? (
        <PickerRGB hsl={lightMode} onChange={setLight} derived={[darkMode]} />
      ) : (
        <PickerRGB hsl={darkMode} onChange={setDark} derived={[lightMode]} />
      )}
    </div>
  );
};

export default ColorPicker;
