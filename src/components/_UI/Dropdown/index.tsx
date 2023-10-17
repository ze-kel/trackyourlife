import type { Placement } from "@floating-ui/react";
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

export interface IDropdown {
  mainPart: React.ReactNode;
  hiddenPart: React.ReactNode;
  visible: boolean;
  setVisible: (b: boolean) => void;
  background?: boolean;
  classNameMain?: string;
  placement?: Placement;
  placeCenter?: boolean;
  offset?: number;
}

const Dropdown = ({
  mainPart,
  hiddenPart,
  visible,
  setVisible,
  background = true,
  classNameMain,
  placement,
  placeCenter,
  offset = 5,
}: IDropdown) => {
  const { x, y, strategy, refs, context } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    placement: placeCenter ? "bottom" : placement,
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

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        className={classNameMain}
        {...getReferenceProps()}
      >
        {mainPart}
      </div>
      {visible && (
        <AnimatePresence>
          <m.div
            ref={refs.setFloating}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "max-content",
            }}
            className={clsx(
              "z-50",
              background &&
                "overflow-hidden rounded-md border border-neutral-200 bg-white p-2  text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
            )}
            {...getFloatingProps()}
          >
            {hiddenPart}
          </m.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Dropdown;
