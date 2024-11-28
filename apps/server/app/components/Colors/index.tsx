import { Fragment, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

import type {
  IColorHSL,
  IColorRGB,
  IColorValue,
} from "@tyl/validators/trackable";
import { clamp } from "@tyl/helpers/animation";
import { HSLToRGB, makeColorString, RGBToHSL } from "@tyl/helpers/colorTools";

import { Input } from "~/@shad/input";
import { RadioTabItem, RadioTabs } from "~/@shad/radio-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/@shad/tabs";
import { Controller, Controller2D } from "./contoller";

export const BetterNumberInput = ({
  value,

  onChange,
  limits = { min: 0, max: 255 },
}: {
  value: number;
  limits?: { min: number; max: number };
  onChange: (v: number) => void;
}) => {
  const [internalValue, setInternalVal] = useState<number | string>(value);

  useIsomorphicLayoutEffect(() => {
    setInternalVal(value);
  }, [value]);

  const [isError, setIsError] = useState(false);

  return (
    <Input
      className="w-full text-center max-sm:p-0 max-sm:text-xs"
      type="number"
      error={isError}
      value={internalValue}
      onChange={(e) => {
        // This code allows input to be empty when editing
        if (Number.isNaN(e.target.valueAsNumber)) {
          setInternalVal("");
          return;
        }
        setInternalVal(e.target.valueAsNumber);
        const clamped = clamp(e.target.valueAsNumber, limits.min, limits.max);

        if (clamped !== e.target.valueAsNumber) {
          setIsError(true);
          return;
        }
        setIsError(false);
        onChange(clamped);
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

const DynamicController = ({
  rgb,
  hsl,
  setRGB,
  setHSL,
  controlKey,
}: {
  rgb: IColorRGB;
  hsl: IColorHSL;
  setRGB: (v: Partial<IColorRGB>) => void;
  setHSL: (v: Partial<IColorHSL>) => void;
  controlKey: IKey;
}) => {
  switch (controlKey) {
    case "red":
      return (
        <Fragment key={controlKey}>
          <Controller2D
            x={rgb.b}
            y={rgb.g}
            maxX={255}
            maxY={255}
            onChange={(b, g) => setRGB({ b, g })}
            background={`linear-gradient(to top left, rgb(${rgb.r}, 255, 255), rgba(${rgb.r}, 128, 128, 0), rgb(${rgb.r}, 0, 0)), linear-gradient(to top right, rgb(${rgb.r},255,0), rgba(${rgb.r}, 153, 150, 0), rgb(${rgb.r}, 0, 255)) rgba(${rgb.r}, 153, 150, 1)`}
            // background={`url("data:image/svg+xml;utf8,%3Csvg preserveAspectRatio='none' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop offset='0' stop-color='%23fff' stop-opacity='0'%3E%3C/stop%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='1'%3E%3C/stop%3E%3C/linearGradient%3E%3Cmask id='m'%3E%3Crect x='0' y='0' width='1' height='1' fill='url(%23g)'%3E%3C/rect%3E%3C/mask%3E%3ClinearGradient id='a' gradientTransform='rotate(90)'%3E%3Cstop offset='0' stop-color='magenta'%3E%3C/stop%3E%3Cstop offset='1' stop-color='white'%3E%3C/stop%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientTransform='rotate(90)'%3E%3Cstop offset='0' stop-color='yellow'%3E%3C/stop%3E%3Cstop offset='1' stop-color='red'%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='1' height='1' fill='url(%23a)' mask='url(%23m)'%3E%3C/rect%3E%3Crect x='0' y='0' width='1' height='1' fill='url(%23b)' mask='url(%23m)' transform='translate(1,1) rotate(180)'%3E%3C/rect%3E%3C/svg%3E")`}
          />
          <Controller
            key={controlKey}
            value={rgb.r}
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
            x={rgb.b}
            y={rgb.g}
            maxX={255}
            maxY={255}
            onChange={(b, g) => setRGB({ b, g })}
            background={`linear-gradient(to bottom right, rgb(0,${rgb.g},0), rgba(128, ${rgb.g}, 128, 0), rgb(255, ${rgb.g}, 255)), linear-gradient(to bottom left, rgb(0, ${rgb.g}, 255), rgba(150, ${rgb.g}, 150, 0), rgb(255, ${rgb.g}, 0)), rgba(150, ${rgb.g}, 150, 1)`}
          />
          <Controller
            key={controlKey}
            value={rgb.g}
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
            x={rgb.g}
            y={rgb.r}
            maxX={255}
            maxY={255}
            onChange={(g, r) => setRGB({ g, r })}
            // , linear-gradient(to bottom left, rgb(0, ${rgb.g}, 255), rgba(150, ${rgb.g}, 150, 0), rgb(255, ${rgb.g}, 0)), rgba(150, ${rgb.g}, 150, 1)
            background={`linear-gradient(to bottom right, rgb(0, 0, ${rgb.b}), rgba(128, 128, ${rgb.b}, 0), rgb(255, 255, ${rgb.b})), linear-gradient(to bottom left, rgb(0, 255, ${rgb.b}), rgba(150, 150, ${rgb.b}, 0), rgb(255, 0, ${rgb.b})), rgba(150, 150, ${rgb.b}, 1)`}
          />
          <Controller
            key={controlKey}
            value={rgb.b}
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
            x={hsl.s}
            y={hsl.l}
            maxX={100}
            maxY={100}
            onChange={(s, l) => setHSL({ s, l })}
            background={`linear-gradient(to bottom, black 0%, transparent 50%, white 100%), linear-gradient(to right, hsl(${hsl.h}, 0%, 50%) 0%, hsl(${hsl.h}, 100%, 50%) 100%)`}
          />
          <Controller
            value={hsl.h}
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
            x={hsl.h}
            y={hsl.l}
            maxX={360}
            maxY={100}
            onChange={(h, l) => setHSL({ h, l })}
            background={`linear-gradient(to bottom, black 0%, transparent 50%, white 100%), ${hueGradientDynamic(
              hsl.s,
              50,
            )}`}
          />
          <Controller
            value={hsl.s}
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
            x={hsl.h}
            y={hsl.s}
            maxX={360}
            maxY={100}
            onChange={(h, s) => setHSL({ h, s })}
            background={`
            linear-gradient(to bottom, hsl(0, 0%, ${
              hsl.l
            }%) 0%, transparent 100%), ${hueGradientDynamic(100, hsl.l)}`}
          />
          <Controller
            value={hsl.l}
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
  onChange,
}: {
  hsl: IColorHSL;
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

  return (
    <div className="grid gap-x-4 gap-y-2">
      <DynamicController
        rgb={rgb}
        hsl={hsl}
        setRGB={setRGB}
        setHSL={setHSL}
        controlKey={controlKey}
      />
      <div className="grid grid-cols-6 gap-1">
        <BetterNumberInput
          value={rgb.r}
          onChange={(v) => setRGB({ r: clamp(v, 0, 255) })}
        />
        <BetterNumberInput
          value={rgb.g}
          onChange={(v) => setRGB({ g: clamp(v, 0, 255) })}
        />
        <BetterNumberInput
          value={rgb.b}
          onChange={(v) => setRGB({ b: clamp(v, 0, 255) })}
        />
        <BetterNumberInput
          value={hsl.h}
          limits={{ min: 0, max: 360 }}
          onChange={(v) => setHSL({ h: v })}
        />
        <BetterNumberInput
          value={hsl.s}
          limits={{ min: 0, max: 100 }}
          onChange={(v) => setHSL({ s: v })}
        />
        <BetterNumberInput
          value={hsl.l}
          limits={{ min: 0, max: 100 }}
          onChange={(v) => setHSL({ l: v })}
        />
      </div>
      <RadioTabs
        className="grid grid-cols-6 gap-1"
        value={controlKey}
        onValueChange={(v) => setControlKey(v as IKey)}
      >
        <RadioTabItem value="red">R</RadioTabItem>
        <RadioTabItem value="green">G</RadioTabItem>
        <RadioTabItem value="blue">B</RadioTabItem>
        <RadioTabItem value="hue">H</RadioTabItem>
        <RadioTabItem value="saturation">S</RadioTabItem>
        <RadioTabItem value="lightness">L</RadioTabItem>
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
  const { lightMode, darkMode } = value;

  const setLight = (lightMode: IColorHSL) => {
    onChange({ darkMode, lightMode });
  };
  const setDark = (darkMode: IColorHSL) => {
    onChange({ darkMode, lightMode });
  };

  const setBoth = (color: IColorHSL) => {
    onChange({ darkMode: color, lightMode: color });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const applyPreset = (color: IColorValue) => {
    onChange(color);
    setMode(
      JSON.stringify(color.lightMode) === JSON.stringify(color.darkMode)
        ? "universal"
        : (theme ?? "dark"),
    );
  };

  const { resolvedTheme: theme } = useTheme();
  const [mode, setMode] = useState(
    JSON.stringify(lightMode) === JSON.stringify(darkMode)
      ? "universal"
      : "dark",
  );

  useEffect(() => {
    setMode(
      JSON.stringify(lightMode) === JSON.stringify(darkMode)
        ? "universal"
        : (theme ?? "dark"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <Tabs value={mode} onValueChange={setMode} className={className}>
      <TabsList className="w-full p-2">
        <TabsTrigger className="w-full" value="universal">
          Universal
        </TabsTrigger>
        <div className="mx-2 h-full w-2 bg-neutral-300 dark:bg-neutral-600"></div>
        <TabsTrigger className="w-full" value="light">
          Light
        </TabsTrigger>
        <TabsTrigger className="w-full" value="dark">
          Dark
        </TabsTrigger>
      </TabsList>
      <TabsContent value="universal">
        <PickerRGB hsl={lightMode} onChange={setBoth} />
      </TabsContent>
      <TabsContent value="light">
        <PickerRGB hsl={lightMode} onChange={setLight} />
      </TabsContent>
      <TabsContent value="dark">
        <PickerRGB hsl={darkMode} onChange={setDark} />
      </TabsContent>
    </Tabs>
  );
};

export default ColorPicker;
