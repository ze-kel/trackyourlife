import type { MouseEventHandler } from "react";
import { useRef } from "react";
import { range } from "src/helpers/animation";

export const Controller = ({
  value,
  maxVal = 100,
  onChange,
  backgroundCurrent,
  backgroundScale,
}: {
  maxVal?: number;
  value: number;
  onChange: (v: number) => void;
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
      onChange(Math.round((position / 100) * maxVal));
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
      className="relative flex h-9 w-full overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background: backgroundScale }}
      onMouseDown={startDrag}
    >
      <div
        className="absolute h-full w-4 -translate-x-1/2 rounded-sm border border-neutral-950 dark:border-neutral-50 "
        style={{
          left: (value / maxVal) * 100 + "%",
        }}
      >
        <div
          className="h-full w-full rounded-sm border border-neutral-50 shadow-sm dark:border-neutral-950"
          style={{ background: backgroundCurrent }}
        ></div>
      </div>
    </div>
  );
};

export const Controller2D = ({
  x,
  y,
  maxX = 100,
  maxY = 100,
  onChange,
  background,
}: {
  x: number;
  y: number;
  maxY?: number;
  maxX?: number;
  onChange: (x: number, y: number) => void;
  background: string;
}) => {
  const controllerRef = useRef<HTMLDivElement>(null);

  const startDrag: MouseEventHandler = (e) => {
    if (!controllerRef.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;
    const { width, height, top, left } =
      controllerRef.current.getBoundingClientRect();

    const moveHadler = (e: MouseEvent) => {
      const x = range(0, width, 0, maxX, e.clientX - left);
      const y = range(0, height, 0, maxY, e.clientY - top);
      onChange(Math.round(x), Math.round(y));
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
      className="relative flex h-48 w-full overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background }}
      onMouseDown={startDrag}
    >
      <div
        className="absolute h-4  w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-neutral-950 dark:border-neutral-50 "
        style={{
          left: (x / maxX) * 100 + "%",
          top: (y / maxY) * 100 + "%",
        }}
      >
        <div className="h-full w-full rounded-sm border border-neutral-50 shadow-sm dark:border-neutral-950"></div>
      </div>
    </div>
  );
};
