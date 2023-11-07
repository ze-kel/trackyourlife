import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { presetsArray } from "@components/_UI/ColorPicker/presets";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@components/_UI/Dropdown";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IColor, IColorValue } from "@t/trackable";
import type { MouseEventHandler } from "react";
import { useRef } from "react";
import { clamp, range } from "src/helpers/animation";

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
      className="relative flex h-9 w-64  rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background: backgroundScale }}
      onMouseDown={startDrag}
    >
      <div
        className="absolute h-full w-4 -translate-x-1/2 rounded-sm border-2 border-neutral-200 bg-white shadow-sm dark:border-neutral-800"
        style={{
          left: value + "%",

          background: backgroundCurrent,
        }}
      ></div>
    </div>
  );
};

const Presets = ({
  setColor,
}: {
  savedColor: IColorValue;
  setColor: (v: IColorValue) => void;
}) => {
  return (
    <div className="flex gap-2">
      {presetsArray.map(({ lightMode, darkMode }, index) => {
        return (
          <div
            onClick={() => setColor({ lightMode, darkMode })}
            key={index}
            className=" h-9 w-9 rounded-md border border-neutral-200 dark:border-neutral-800"
            style={{
              background: `hsl(${lightMode.hue}, ${lightMode.saturation}%, ${lightMode.lightness}%)`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

const hueGradient =
  "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)";

const Picker = ({
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
    <div className="grid w-fit grid-cols-[1fr_3.5rem] gap-x-4 gap-y-2">
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

const ColorPicker = ({
  value,
  onChange,
}: {
  value: IColorValue;
  onChange: (v: IColorValue) => void;
}) => {
  const { lightMode, darkMode } = value;

  const currentLight = `hsl(${lightMode.hue}, ${lightMode.saturation}%, ${lightMode.lightness}%)`;
  const currentDark = `hsl(${darkMode.hue}, ${darkMode.saturation}%, ${darkMode.lightness}%)`;

  const setLight = (lightMode: IColor) => {
    onChange({ darkMode, lightMode });
  };
  const setDark = (darkMode: IColor) => {
    onChange({ darkMode, lightMode });
  };

  return (
    <div className="flex gap-4">
      <Dropdown>
        <DropdownTrigger>
          <button className="relative flex h-9 w-16 items-center gap-4 overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent pl-4 font-mono text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 ">
            <div
              className="absolute left-0 top-0 z-10 h-9 w-16 -translate-x-1/4 -translate-y-1/3 -rotate-45"
              style={{ background: currentLight }}
            ></div>
            <div
              className="absolute left-0 top-0 h-full w-full"
              style={{ background: currentDark }}
            ></div>
          </button>
        </DropdownTrigger>

        <DropdownContent className="p-4">
          <Tabs defaultValue="light">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="light">
                Light
              </TabsTrigger>
              <TabsTrigger className="w-full" value="dark">
                Dark
              </TabsTrigger>
            </TabsList>
            <TabsContent value="light">
              <Picker value={lightMode} onChange={setLight} />
            </TabsContent>
            <TabsContent value="dark">
              <Picker value={darkMode} onChange={setDark} />
            </TabsContent>
          </Tabs>
        </DropdownContent>
      </Dropdown>

      <Presets savedColor={value} setColor={onChange} />
    </div>
  );
};

export default ColorPicker;
