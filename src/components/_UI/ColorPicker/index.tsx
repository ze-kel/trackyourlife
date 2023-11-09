import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { presetsArray } from "@components/_UI/ColorPicker/presets";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IColor, IColorValue } from "@t/trackable";
import type { CSSProperties, MouseEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { clamp, range } from "src/helpers/animation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const makeColorString = (color: IColor) =>
  `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

const Controller = ({
  value,
  update,
  backgroundCurrent,
  backgroundScale,
}: {
  value: number;
  update: (v: number) => void;
  backgroundCurrent: string;
  backgroundScale: string;
}) => {
  const controllerRef = useRef<HTMLDivElement>(null);

  const startDrag: MouseEventHandler = (e) => {
    if (!controllerRef.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;
    const { width, left } = controllerRef.current.getBoundingClientRect();

    const moveHadler = (e: MouseEvent) => {
      const position = range(0, width, 0, 100, e.clientX - left);
      update(position);
    };

    moveHadler(e as unknown as MouseEvent);

    const upHandler = () => {
      removeEventListener("mousemove", moveHadler);
      removeEventListener("mouseup", upHandler);
    };
    addEventListener("mousemove", moveHadler);
    addEventListener("mouseup", upHandler);
  };

  return (
    <div
      ref={controllerRef}
      className="w-fullrounded-md relative flex h-9 border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background: backgroundScale }}
      onMouseDown={startDrag}
    >
      <div
        className="absolute h-full w-4 -translate-x-1/2 rounded-sm border-2 border-neutral-50 shadow-sm dark:border-neutral-950"
        style={{
          left: value + "%",

          background: backgroundCurrent,
        }}
      ></div>
    </div>
  );
};

export const ColorDisplay = ({
  color,
  className,
  style,
}: {
  color: IColorValue;
  className?: string;
  style?: CSSProperties;
}) => {
  const currentLight = makeColorString(color.lightMode);
  const currentDark = makeColorString(color.darkMode);

  return (
    <div
      className={cn(
        "relative flex h-9 w-full items-center overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent font-mono text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800",
        className,
      )}
      style={style}
    >
      <div
        className="absolute left-0 top-0 z-10 h-full w-full"
        style={{
          background: currentLight,
          // Manual transform because order matters
          transform: "rotate(45deg) translateX(-50%) scaleY(10)",
        }}
      ></div>
      <div
        className="absolute left-0 top-0 h-full w-full"
        style={{ background: currentDark }}
      ></div>
    </div>
  );
};

export const Presets = ({
  setColor,
  className,
}: {
  savedColor: IColorValue;
  setColor: (v: IColorValue) => void;
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-8 gap-1", className)}>
      {presetsArray.map((col, index) => {
        return (
          <button key={index} onClick={() => setColor(col)}>
            <ColorDisplay color={col} />
          </button>
        );
      })}
    </div>
  );
};

const hueGradient =
  "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)";

export const Picker = ({
  value,
  onChange,
}: {
  value: IColor;
  onChange: (v: IColor) => void;
}) => {
  const { hue, saturation, lightness } = value;

  const setHue = (hue: number) => {
    onChange({ hue, saturation, lightness });
  };
  const setSaturation = (saturation: number) => {
    onChange({ hue, saturation, lightness });
  };
  const setLightness = (lightness: number) => {
    onChange({ hue, saturation, lightness });
  };
  return (
    <div className="grid grid-cols-[1fr_3.5rem] gap-x-4 gap-y-2">
      <Controller
        value={(hue / 360) * 100}
        update={(v) => setHue(Math.round((v / 100) * 360))}
        backgroundScale={hueGradient}
        backgroundCurrent={`hsl(${hue}, 100%, 50%)`}
      />
      <Input
        className="w-14 text-center"
        type="number"
        value={hue}
        onChange={(e) =>
          setHue(Math.round(clamp(e.target.valueAsNumber, 0, 360)))
        }
      />

      <Controller
        value={saturation}
        update={(v) => setSaturation(Math.round(clamp(v, 0, 100)))}
        backgroundScale={`linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%) 0%, hsl(${hue},  100%, ${lightness}%) 100%)`}
        backgroundCurrent={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      />
      <Input
        className="w-14 text-center"
        type="number"
        value={saturation}
        onChange={(e) =>
          setSaturation(Math.round(clamp(e.target.valueAsNumber, 0, 100)))
        }
      />

      <Controller
        value={lightness}
        update={(v) => setLightness(Math.round(clamp(v, 0, 100)))}
        backgroundScale={`linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%) 0%, hsl(${hue},  ${saturation}%, 50%) 50%, hsl(${hue}, ${saturation}%, 100%) 100%)`}
        backgroundCurrent={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      />
      <Input
        className="w-14 text-center"
        type="number"
        value={lightness}
        onChange={(e) =>
          setLightness(Math.round(clamp(e.target.valueAsNumber, 0, 100)))
        }
      />
    </div>
  );
};

export const ColorPicker = ({
  value,
  onChange,
}: {
  value: IColorValue;
  onChange: (v: IColorValue) => void;
}) => {
  const { lightMode, darkMode } = value;

  const setLight = (lightMode: IColor) => {
    onChange({ darkMode, lightMode });
  };
  const setDark = (darkMode: IColor) => {
    onChange({ darkMode, lightMode });
  };

  const setBoth = (color: IColor) => {
    onChange({ darkMode: color, lightMode: color });
  };

  const applyPreset = (color: IColorValue) => {
    onChange(color);
    setMode(
      JSON.stringify(color.lightMode) === JSON.stringify(color.darkMode)
        ? "universal"
        : resolvedTheme,
    );
  };

  const { resolvedTheme } = useTheme();
  const [mode, setMode] = useState(
    JSON.stringify(lightMode) === JSON.stringify(darkMode)
      ? "universal"
      : resolvedTheme,
  );

  useEffect(() => {
    setMode(
      JSON.stringify(lightMode) === JSON.stringify(darkMode)
        ? "universal"
        : resolvedTheme,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);

  return (
    <>
      <Tabs value={mode} onValueChange={setMode}>
        <TabsList className="w-full p-2">
          <TabsTrigger className="w-full " value="universal">
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
          <Picker value={lightMode} onChange={setBoth} />
        </TabsContent>
        <TabsContent value="light">
          <Picker value={lightMode} onChange={setLight} />
        </TabsContent>
        <TabsContent value="dark">
          <Picker value={darkMode} onChange={setDark} />
        </TabsContent>
      </Tabs>
      <Presets savedColor={value} setColor={applyPreset} className="mt-2" />
    </>
  );
};

export default ColorPicker;
