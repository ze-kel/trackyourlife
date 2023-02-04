import clsx from "clsx";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef } from "react";

export interface IDropdown {
  mainPart: React.ReactNode;
  hiddenPart: React.ReactNode;
  visible: boolean;
  setVisible: (b: boolean) => void;
  align?: "left" | "center" | "right";
  vAlign?: "top" | "center" | "bottom";
  background?: boolean;
  classNameMain?: string;
}

const Dropdown = ({
  mainPart,
  hiddenPart,
  visible,
  setVisible,
  align = "left",
  vAlign = "top",
  background = true,
  classNameMain,
}: IDropdown) => {
  const hiddenRef = useRef<HTMLDivElement>(null);

  const open = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setVisible(!visible);
  };

  useEffect(() => {
    const closeChecker = (e: MouseEvent) => {
      if (e.target && hiddenRef.current) {
        const t = e.target as Element;
        if (!hiddenRef.current.contains(t)) {
          setVisible(false);
        }
      }
    };

    window.addEventListener("click", closeChecker);

    return () => {
      window.removeEventListener("click", closeChecker);
    };
  }, [setVisible]);

  return (
    <div className="relative">
      <div onClick={open} className={classNameMain}>
        {mainPart}
      </div>
      {visible && (
        <div
          ref={hiddenRef}
          className={clsx(
            "absolute z-10",
            background &&
              "my-1 rounded-sm border-2 bg-neutral-900 p-2 text-neutral-200 dark:border-neutral-800 dark:bg-neutral-900",
            align === "right" && "right-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            vAlign === "top" && "top-full",
            vAlign === "center" && "top-1/2 -translate-y-1/2"
          )}
        >
          {hiddenPart}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
