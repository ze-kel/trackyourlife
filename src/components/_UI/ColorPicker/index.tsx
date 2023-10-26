import type { IColorValue } from "@t/trackable";
import { MouseEventHandler, useRef, useState } from "react";
import { range } from "src/helpers/animation";

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
      className="relative flex h-9 w-64 rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background: backgroundScale }}
      onMouseDown={startDrag}
    >
      <div
        className="absolute  h-full w-6 -translate-x-1/2 rounded-md border-2 border-neutral-200 bg-white shadow-sm dark:border-neutral-800"
        style={{
          left: value + "%",
          background: backgroundCurrent,
        }}
      ></div>
    </div>
  );
};

const hueGradient =
  "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)";

const ColorPicker = ({ savedColor }: { savedColor: IColorValue }) => {
  const [hue, setHue] = useState(savedColor.hue);
  const [saturation, setSaturation] = useState(savedColor.saturation);
  const [lightness, setLightness] = useState(savedColor.lightness);

  return (
    <div>
      {hue}
      <Controller
        value={(hue / 360) * 100}
        update={(v) => setHue((v / 100) * 360)}
        backgroundScale={hueGradient}
        backgroundCurrent={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      />
      <Controller
        value={saturation}
        update={setSaturation}
        backgroundScale={`linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%) 0%, hsl(${hue},  100%, ${lightness}%) 100%)`}
        backgroundCurrent={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      />
      <Controller
        value={lightness}
        update={setLightness}
        backgroundScale={`linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%) 0%, hsl(${hue},  ${saturation}%, 50%) 50%, hsl(${hue}, ${saturation}%, 100%) 100%)`}
        backgroundCurrent={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      />
    </div>
  );
};

export default ColorPicker;
