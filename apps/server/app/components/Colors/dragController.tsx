import type { CSSProperties, MutableRefObject } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { clamp } from "@tyl/helpers";
import { range } from "@tyl/helpers/animation";

import { cn } from "~/@shad/utils";
import { useRefSize } from "~/utils/useRefSize";

const ControllerContext = createContext<{
  disableX: boolean;
  disableY: boolean;
  width: number;
  height: number;
  dataRef: MutableRefObject<{
    width: number;
    height: number;
    left: number;
    top: number;
  }>;
  forceRefresh: () => void;
  valueToX: (x: number) => number;
  xToValue: (x: number) => number;
  valueToY: (y: number) => number;
  yToValue: (y: number) => number;
  pointToDragAwayPercent: ({ x, y }: { x: number; y: number }) => number;
  selectedPoint: string | null;
  setSelectedPoint: (id: string | null) => void;
  onDragAway?: (id: string) => void;
  isDraggingGlobalRef: MutableRefObject<boolean>;
} | null>(null);

const useControllerContextSafe = () => {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error(
      "useControllerContext must be used within a ControllerRoot",
    );
  }
  return context;
};

type ControllerRootProps = React.ComponentPropsWithoutRef<"div"> & {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  initialSelectedPointId?: string;
  disableY?: boolean;
  disableX?: boolean;
  onEmptySpaceClick?: ({ x, y }: { x: number; y: number }) => void;
  onDragAway?: (id: string) => void;
  dragAwayDistance?: number;
  selectedPoint?: string | null;
  onSelectedPointChange?: (id: string | null) => void;
};

const getPanClass = (disableX: boolean, disableY: boolean) => {
  if (disableX && disableY) return "touch-none";
  if (disableX) return "touch-pan-x";
  if (disableY) return "touch-pan-y";
  return "touch-auto";
};

const getNearestSquarePoint = (
  x: number,
  y: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
) => {
  return { x: clamp(x, left, right), y: clamp(y, top, bottom) };
};

export const ControllerRoot = ({
  className,
  children,
  xMin = 0,
  xMax = 100,
  yMin = 0,
  yMax = 100,
  initialSelectedPointId,
  disableY = false,
  disableX = false,
  onEmptySpaceClick,
  onDragAway,
  dragAwayDistance = 150,
  selectedPoint,
  onSelectedPointChange,
  ...props
}: ControllerRootProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height, dataRef, forceRefresh } = useRefSize(ref);
  const isDraggingGlobalRef = useRef(false);

  /* These convert values to percentages for simple positioning */
  const valueToY = useCallback(
    (y: number) => {
      if (disableY) return 50;
      return range(yMin, yMax, 0, 100, y);
    },
    [yMin, yMax, disableY],
  );
  const valueToX = useCallback(
    (x: number) => {
      if (disableX) return 50;
      return range(xMin, xMax, 0, 100, x);
    },
    [xMin, xMax, disableX],
  );

  // These convert from coordinates in screen space to values
  const xToValue = useCallback(
    (x: number) => {
      if (disableX) return 50;
      return Math.round(
        range(
          dataRef.current.left,
          dataRef.current.width + dataRef.current.left,
          xMin,
          xMax,
          x,
        ),
      );
    },
    [xMin, xMax, dataRef, disableX],
  );
  const yToValue = useCallback(
    (y: number) => {
      if (disableY) return 50;
      return Math.round(
        range(
          dataRef.current.top,
          dataRef.current.height + dataRef.current.top,
          yMin,
          yMax,
          y,
        ),
      );
    },
    [yMin, yMax, dataRef, disableY],
  );

  // If onDragAway when a person drags away far enough it gets called, this calculates how far we are from that point
  const pointToDragAwayPercent = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (typeof onDragAway !== "function") return 0;

      const { x: nX, y: nY } = getNearestSquarePoint(
        x,
        y,
        dataRef.current.left,
        dataRef.current.top,
        dataRef.current.left + width,
        dataRef.current.top + height,
      );

      const distance = Math.sqrt((x - nX) ** 2 + (y - nY) ** 2);

      return range(dragAwayDistance / 4, dragAwayDistance, 0, 100, distance);
    },
    [dataRef, width, height, dragAwayDistance, onDragAway],
  );

  const externallyControlled =
    typeof selectedPoint !== "undefined" &&
    typeof onSelectedPointChange === "function";
  const [selectedPointInternal, setSelectedPointInternal] = useState<
    string | null
  >(initialSelectedPointId ?? null);

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isDraggingGlobalRef.current) return;
    e.stopPropagation();

    onEmptySpaceClick?.({
      x: xToValue(e.clientX),
      y: yToValue(e.clientY),
    });
  };

  /*
  By default in boundary values(i.e 0,0) controller will be partially ouside Root container becuase it's center is value.
  It's ofter looks better to make it apper as if it's inside the root container
  To achieve this you can add padding to ControllerRoot, and the actual mapped area will be smaller by that padding
  The only problem is that then onEmptySpaceClick wont work on padding. This solves it by setting it to boundary value when clicked.
  */
  const clickHandlerOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const { x: nX, y: nY } = getNearestSquarePoint(
      e.clientX,
      e.clientY,
      dataRef.current.left,
      dataRef.current.top,
      dataRef.current.left + width,
      dataRef.current.top + height,
    );

    onEmptySpaceClick?.({
      x: xToValue(nX),
      y: yToValue(nY),
    });
  };

  return (
    <div
      className={cn(
        "relative box-border rounded-md border-2 border-neutral-200 dark:border-neutral-800",
        disableX ? "" : "px-2 max-sm:px-3",
        disableY ? "" : "py-2 max-sm:py-3",
        getPanClass(disableX, disableY),
        className,
      )}
      onClick={clickHandlerOutside}
      {...props}
    >
      <div ref={ref} className="relative h-full w-full" onClick={clickHandler}>
        <ControllerContext.Provider
          value={{
            disableX,
            disableY,
            width,
            height,
            dataRef,
            forceRefresh,
            valueToX,
            xToValue,
            valueToY,
            yToValue,
            selectedPoint: externallyControlled
              ? selectedPoint
              : selectedPointInternal,
            setSelectedPoint: externallyControlled
              ? onSelectedPointChange
              : setSelectedPointInternal,
            onDragAway,
            pointToDragAwayPercent,
            isDraggingGlobalRef,
          }}
        >
          {children}
        </ControllerContext.Provider>
      </div>
    </div>
  );
};

type ControllerPointProps = React.ComponentPropsWithoutRef<"div"> & {
  x?: number;
  y?: number;
  id: string;
  onValueChange?: ({ x, y }: { x: number; y: number }) => void;
};

export const ControllerPoint = ({
  children,
  className,
  style,
  x,
  y,
  onValueChange,
  id,
  ...props
}: ControllerPointProps) => {
  const {
    width,
    height,
    valueToX,
    xToValue,
    valueToY,
    yToValue,
    selectedPoint,
    setSelectedPoint,
    onDragAway,
    pointToDragAwayPercent,
    disableX,
    disableY,
    isDraggingGlobalRef,
    forceRefresh,
  } = useControllerContextSafe();
  const isSelected = selectedPoint === id;

  const isActive = typeof onValueChange === "function";

  const [isDragging, setIsDragging] = useState(false);

  const xPercent = valueToX(x ?? 0);
  const yPercent = valueToY(y ?? 0);

  const pickupPosition = useRef({ x: 0, y: 0 });

  const [dragAwayPercent, setDragAwayPercent] = useState(0);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.ctrlKey) return;
    forceRefresh();
    e.preventDefault();
    e.stopPropagation();
    setSelectedPoint(id);
    setIsDragging(true);
    isDraggingGlobalRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    pickupPosition.current = {
      x: e.clientX - (rect.left + rect.width / 2),
      y: e.clientY - (rect.top + rect.height / 2),
    };
  };
  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    setDragAwayPercent(
      pointToDragAwayPercent({
        x: e.clientX - pickupPosition.current.x,
        y: e.clientY - pickupPosition.current.y,
      }),
    );

    onValueChange?.({
      x: xToValue(e.clientX - pickupPosition.current.x),
      y: yToValue(e.clientY - pickupPosition.current.y),
    });
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.stopPropagation();
    isDraggingGlobalRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragAwayPercent >= 100) {
      onDragAway?.(id);
    }
    setDragAwayPercent(0);
  };

  const handlers = isActive
    ? {
        onPointerDown: startDrag,
        onPointerUp: endDrag,
        onPointerMove: moveDrag,
      }
    : {};

  return (
    <div
      data-selected={isSelected}
      data-active={isActive}
      data-fading={dragAwayPercent > 0}
      data-disabled-x={disableX}
      data-disabled-y={disableY}
      className={cn(
        "absolute box-border",
        "w-4 data-[disabled-x=true]:w-[110%] max-sm:w-6",
        "h-4 data-[disabled-y=true]:h-[110%] max-sm:h-6",
        "border-2 border-neutral-800 ring-2 ring-neutral-200 dark:border-neutral-200 dark:ring-neutral-800",
        "data-[active=false]:border data-[active=false]:ring-1",
        "opacity-50 data-[selected=true]:opacity-100",
        "rounded-md",
        "transition-opacity",
        isActive
          ? dragAwayPercent >= 100
            ? "cursor-default"
            : "cursor-grab"
          : "cursor-not-allowed",
        isSelected ? "z-20" : "z-10",
        className,
      )}
      {...handlers}
      onTouchStart={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
      style={
        {
          left: width ? 0 : xPercent + "%",
          top: height ? 0 : yPercent + "%",
          transform: `translateX(calc(-50% + ${
            width ? (width * xPercent) / 100 : 0
          }px)) translateY(calc(-50% + ${
            height ? (height * yPercent) / 100 : 0
          }px)) scale(${range(0, 100, 1, 0, dragAwayPercent)})`,
          "--drag-away-fade": dragAwayPercent,
          opacity:
            dragAwayPercent > 0
              ? range(0, 100, 0, 1, dragAwayPercent)
              : undefined,

          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
};
