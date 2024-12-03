import type { MouseEventHandler, RefObject, TouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { range } from "@tyl/helpers/animation";

import { cn } from "~/@shad/utils";

interface IUseRefSizeReturn {
  width: number;
  height: number;
  top: number;
  left: number;
}

// Note that when we access properties on render we can use regular data to rerender on change
// But when we access stuff in handlers(i.e mousemove\touchmove) we should use ref to guarantee up to date values
export const useRefSize = (ref: RefObject<HTMLDivElement>) => {
  const dataRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const [data, setData] = useState<IUseRefSizeReturn>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const calculate = useCallback(() => {
    if (!ref.current) return;
    const { width, height, top, left } = ref.current.getBoundingClientRect();
    const data = {
      width,
      height,
      top,
      left,
    };

    setData(data);
    dataRef.current = data;
  }, [ref]);

  useEffect(() => {
    calculate();
    addEventListener("resize", calculate);
    addEventListener("scroll", calculate);
    return () => {
      removeEventListener("resize", calculate);
      removeEventListener("scroll", calculate);
    };
  }, [calculate]);

  // Force refresh is useful when initial rendering position will be inaccurate later(i.e. modal that animate when appearing)
  return { ...data, dataRef, forceRefresh: calculate };
};

export const Controller = ({
  // Index 0 is the actual value, everything else is derived values and are display only
  values,
  maxVal = 100,
  onChange,
  backgroundCurrent,
  backgroundScale,
}: {
  values: number[];
  maxVal?: number;
  onChange: (v: number) => void;
  backgroundCurrent: string;
  backgroundScale: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { width, dataRef, forceRefresh } = useRefSize(ref);

  const move = (x: number) => {
    const { width, left } = dataRef.current;
    const position = range(0, width, 0, 100, x - left);

    onChange(Math.round((position / 100) * maxVal));
  };

  const startMouseDrag: MouseEventHandler = (e) => {
    forceRefresh();
    // Left click only
    if (e.nativeEvent.button !== 0) return;

    const moveHandler = (e: MouseEvent) => {
      move(e.clientX);
    };

    moveHandler(e as unknown as MouseEvent);

    const upHandler = () => {
      removeEventListener("mousemove", moveHandler);
      removeEventListener("mouseup", upHandler);
    };
    addEventListener("mousemove", moveHandler);
    addEventListener("mouseup", upHandler);
  };

  const dragHandler = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) {
      move(t.clientX);
    }
  };

  const filteredPoints = values
    .filter((v, i) => i === values.findIndex((a) => a === v))
    .reverse();

  return (
    <div
      className={cn(
        "relative flex h-9 w-full touch-none rounded-lg border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800",
      )}
      style={{ background: backgroundScale }}
      onMouseDown={startMouseDrag}
      onTouchMove={dragHandler}
    >
      <div ref={ref} className="relative w-full">
        {filteredPoints.map((value, i) => (
          <ControllerPoint
            key={i}
            primary={
              i === filteredPoints.length - 1 || filteredPoints.length === 1
            }
            value={value}
            maxVal={maxVal}
            width={width}
            backgroundCurrent={backgroundCurrent}
          />
        ))}
      </div>
    </div>
  );
};

export const ControllerPoint = ({
  value,
  maxVal,
  width,
  primary,
  backgroundCurrent,
}: {
  value: number;
  maxVal: number;
  width: number;
  backgroundCurrent: string;
  primary?: boolean;
}) => {
  const xPercent = (value / maxVal) * 100;

  return (
    <div
      className={cn(
        "absolute top-1/2 z-20 cursor-grab overflow-hidden rounded-lg border-2 border-neutral-50 border-transparent dark:border-neutral-950",
        primary ? "h-[120%] border-2" : "h-full border opacity-80",
      )}
      style={{
        left: width ? 0 : xPercent + "%",
        transform: `translateX(calc(-50% + ${
          width ? (width * xPercent) / 100 : 0
        }px)) translateY(-50%)`,
      }}
    >
      <div
        className={cn(
          "h-full overflow-hidden rounded-md border-neutral-950 shadow-lg shadow-neutral-50 dark:border-neutral-50",
          primary ? "border-2" : "border",
        )}
      >
        <div
          className={cn(
            "h-full w-2 rounded-[0.3rem] border border-neutral-50 dark:border-neutral-950",
            primary ? "w-2" : "w-1",
          )}
          style={{
            background: primary ? backgroundCurrent : undefined,
          }}
        ></div>
      </div>
    </div>
  );
};

export const Controller2D = ({
  // Index 0 is the actual value, everything else is derived values and are display only
  points,
  maxX = 100,
  maxY = 100,
  onChange,
  background,
}: {
  points: { x: number; y: number }[];
  maxY?: number;
  maxX?: number;
  onChange: (x: number, y: number) => void;
  background: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { width, left, height, dataRef, forceRefresh } = useRefSize(ref);

  const move = (xPos: number, yPos: number) => {
    const { width, height } = dataRef.current;
    const x = range(0, width, 0, maxX, xPos);
    const y = range(0, height, 0, maxY, yPos);
    onChange(Math.round(x), Math.round(y));
  };

  const starMouseDrag: MouseEventHandler = (e) => {
    // Left click only
    if (e.nativeEvent.button !== 0) return;
    forceRefresh();

    const moveHandler = (e: MouseEvent) => {
      move(e.clientX - dataRef.current.left, e.clientY - dataRef.current.top);
    };

    moveHandler(e as unknown as MouseEvent);

    const upHandler = () => {
      removeEventListener("mousemove", moveHandler);
      removeEventListener("mouseup", upHandler);
    };
    addEventListener("mousemove", moveHandler);
    addEventListener("mouseup", upHandler);
  };

  const touchStart = (e: TouchEvent<HTMLDivElement>) => {
    forceRefresh();
    touchHandler(e);
  };

  const touchHandler = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) {
      move(t.clientX - left, t.clientY - dataRef.current.top);
    }
  };

  // We need to filter out duplicates place the primary point last for it to show on top without z-index
  const fp = points
    .filter((v, i) => i === points.findIndex((p) => p.x === v.x && p.y === v.y))
    .reverse();

  return (
    <div
      ref={ref}
      className="relative flex h-48 w-full touch-none overflow-hidden rounded-md border-2 border-neutral-200 bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
      style={{ background }}
      onMouseDown={starMouseDrag}
      onTouchMove={touchHandler}
      onTouchStart={touchStart}
    >
      {fp.map((point, i) => (
        <Controller2DPoint
          key={i}
          primary={i === fp.length - 1 || fp.length === 1}
          x={point.x}
          y={point.y}
          maxX={maxX}
          maxY={maxY}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
};

const Controller2DPoint = ({
  x,
  y,
  maxX,
  maxY,
  width,
  height,
  primary,
}: {
  x: number;
  y: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  primary?: boolean;
}) => {
  const xPercent = (x / maxX) * 100;
  const yPercent = (y / maxY) * 100;

  return (
    <div
      className={cn(
        primary ? "h-6 w-6 cursor-grab border-2" : "h-3 w-3 border",
        "absolute z-20 overflow-hidden rounded-lg border-neutral-50 border-transparent dark:border-neutral-950",
      )}
      style={{
        // This is fallback for SSR where we cant get width and therefore cant do Translate()
        left: width ? 0 : xPercent + "%",
        top: height ? 0 : yPercent + "%",

        transform: `translate(calc(-50% + ${
          width ? width * (xPercent / 100) : 0
        }px ), calc(-50% + ${height ? height * (yPercent / 100) : 0}px))`,
      }}
    >
      <div
        className={cn(
          "h-full overflow-hidden rounded-md border-neutral-950 shadow-lg shadow-neutral-50 dark:border-neutral-50",
          primary ? "border-2" : "border",
        )}
      >
        <div className="h-full w-full rounded-[0.3rem] border border-neutral-50 dark:border-neutral-950"></div>
      </div>
    </div>
  );
};
