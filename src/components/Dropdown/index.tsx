/* eslint-disable react/display-name */
import type {
  FloatingContext,
  Placement,
  ReferenceType,
} from "@floating-ui/react";
import {
  useFloating,
  offset as offsetMiddleware,
  flip,
  shift,
  autoUpdate,
  useClick,
  useInteractions,
  useDismiss,
} from "@floating-ui/react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export type IDropdown = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  background?: boolean;
  placement?: Placement;
  placeCenter?: boolean;
  offset?: number;
  children: ReactNode;
};

const DropdownContext = createContext<{
  background?: boolean;
  context?: FloatingContext<ReferenceType>;
}>({
  background: false,
});

const DropdownTrigger = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { context } = useContext(DropdownContext);

  if (!context) throw new Error("");

  const { getReferenceProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  return (
    <div
      ref={context.refs.setReference}
      className={className}
      {...getReferenceProps()}
    >
      {children}
    </div>
  );
};

const DropdownContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { background, context } = useContext(DropdownContext);
  // const { refs, context, strategy, x, y } = useFloating({ nodeId });

  if (!context) throw new Error("");

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  return (
    context.open && (
      <AnimatePresence>
        <m.div
          ref={context.refs.setFloating}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            position: context.strategy,
            top: context.y ?? 0,
            left: context.x ?? 0,
            width: "max-content",
          }}
          className={clsx(
            "z-50",
            background &&
              "overflow-hidden rounded-md border border-neutral-200 bg-white p-2 text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
            className,
          )}
          {...getFloatingProps()}
        >
          {children}
        </m.div>
      </AnimatePresence>
    )
  );
};

const Dropdown = ({
  open,
  onOpenChange,
  background = true,
  placement,
  placeCenter,
  offset = 5,
  children,
}: IDropdown) => {
  const [internalOpen, internalSetOpen] = useState(false);

  const { context } = useFloating({
    open: typeof onOpenChange === "function" ? open : internalOpen,
    onOpenChange:
      typeof onOpenChange === "function" ? onOpenChange : internalSetOpen,
    placement: placeCenter ? "bottom" : placement || "bottom-start",
    middleware: [
      offsetMiddleware(
        placeCenter
          ? ({ rects }) =>
              -rects.reference.height / 2 - rects.floating.height / 2
          : offset,
      ),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <DropdownContext.Provider
      value={{
        background,
        context: context,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export { Dropdown, DropdownContent, DropdownTrigger };
