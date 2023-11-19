/* eslint-disable react/display-name */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useWindowSize } from "src/helpers/useWindowSize";
import { Cross1Icon } from "@radix-ui/react-icons";

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

const DropdownMobileTitleContext = createContext("");

export const DropdownMobileTitleProvider = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <DropdownMobileTitleContext.Provider value={title}>
      {children}
    </DropdownMobileTitleContext.Provider>
  );
};

// Corresponds to sm in tailwind
const MOBILE_BREAKPOINT = 640;

const defaultBackgroundClasses =
  "overflow-hidden box-border rounded-md border border-neutral-200 bg-white p-2 text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50";

const DropdownContent = ({
  className,
  disableMobileAdaptation,
  children,
}: {
  disableMobileAdaptation?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const { background, context } = useContext(DropdownContext);

  if (!context) throw new Error("");

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const size = useWindowSize();

  const isMobile = size.width < MOBILE_BREAKPOINT;

  const mobileTitle = useContext(DropdownMobileTitleContext);

  if (isMobile && !disableMobileAdaptation) {
    return (
      <AnimatePresence>
        {context.open && (
          <div
            ref={context.refs.setFloating}
            className={cn(
              "z-50",
              "absolute left-0 top-0 h-full w-full pt-20 shadow-lg",
            )}
          >
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 0.5,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => context.onOpenChange(false)}
              className="absolute left-0 top-0 z-50 h-full w-full bg-black "
            />
            <m.div
              initial={{
                top: "100%",
              }}
              animate={{
                top: 0,
              }}
              exit={{ top: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0, 0.4, 0.4, 1.05] }}
              className={cn(
                background && defaultBackgroundClasses + " rounded-2xl",
                "h-full w-full",
                className,
                "relative z-[51] overflow-scroll",
              )}
            >
              <div className="flex items-center justify-between px-2 pb-3">
                <h2 className="text-xl">{mobileTitle}</h2>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => context.onOpenChange(false)}
                >
                  <Cross1Icon />
                </Button>
              </div>
              {children}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {context.open && (
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
          className={cn(
            "z-50",
            background && defaultBackgroundClasses,
            className,
          )}
          {...getFloatingProps()}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
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
