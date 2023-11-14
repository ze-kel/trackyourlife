import type { MouseEventHandler, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { range } from "src/helpers/animation";

const useRefSize = (ref: RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const r = () => {
      if (!ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);
    };
    r();
    addEventListener("resize", r);
    return () => {
      removeEventListener("resize", r);
    };
  });

  return { width, height };
};

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
  const ref = useRef<HTMLDivElement>(null);

  const { width } = useRefSize(ref);

  const startDrag: MouseEventHandler = (e) => {
    if (!ref.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;
    const { width, left } = ref.current.getBoundingClientRect();

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

  const xPercent = (value / maxVal) * 100;

  return (
    <div
      className="relative flex h-9 w-full rounded-lg border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background: backgroundScale }}
      onMouseDown={startDrag}
    >
      <div ref={ref} className="relative w-full">
        <div
          className={
            "absolute top-1/2 z-20 h-[120%] cursor-grab overflow-hidden rounded-lg border-2 border-neutral-50 border-transparent dark:border-neutral-950"
          }
          style={{
            left: width ? 0 : xPercent + "%",
            transform: `translateX(calc(-50% + ${
              width ? (width * xPercent) / 100 : 0
            }px)) translateY(-50%)`,
          }}
        >
          <div className="h-full overflow-hidden rounded-md border-2 border-neutral-950 shadow-lg shadow-neutral-50 dark:border-neutral-50">
            <div
              className="h-full w-2 rounded-[0.3rem] border border-neutral-50 dark:border-neutral-950"
              style={{ background: backgroundCurrent }}
            ></div>
          </div>
        </div>
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
  const ref = useRef<HTMLDivElement>(null);

  const { width, height } = useRefSize(ref);

  const startDrag: MouseEventHandler = (e) => {
    if (!ref.current) return;
    // Left click only
    if (e.nativeEvent.button !== 0) return;
    const { width, height, top, left } = ref.current.getBoundingClientRect();

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

  const xPercent = (x / maxX) * 100;
  const yPercent = (y / maxY) * 100;

  return (
    <div
      ref={ref}
      className="relative flex h-48 w-full overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 "
      style={{ background }}
      onMouseDown={startDrag}
    >
      <div
        className={
          "absolute z-20 h-6 w-6 cursor-grab overflow-hidden rounded-lg border-2 border-neutral-50 border-transparent dark:border-neutral-950"
        }
        style={{
          // This is fallback for SSR where we cant get width and therefore cant do Translate()
          left: width ? 0 : xPercent + "%",
          top: height ? 0 : yPercent + "%",

          transform: `translate(calc(-50% + ${
            width ? width * (xPercent / 100) : 0
          }px ), calc(-50% + ${height ? height * (yPercent / 100) : 0}px))`,
        }}
      >
        <div className="h-full overflow-hidden rounded-md border-2 border-neutral-950 shadow-lg shadow-neutral-50 dark:border-neutral-50">
          <div className="h-full w-full rounded-[0.3rem] border border-neutral-50 dark:border-neutral-950"></div>
        </div>
      </div>
    </div>
  );
};
