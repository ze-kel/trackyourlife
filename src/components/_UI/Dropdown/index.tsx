import clsx from "clsx";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef } from "react";

export interface IDropdown {
  mainPart: React.ReactNode;
  hiddenPart: React.ReactNode;
  visible: boolean;
  setVisible: (b: boolean) => void;
  align?: "left" | "right";
  vAlign?: "top" | "center" | "bottom";
}

const Dropdown = ({
  mainPart,
  hiddenPart,
  visible,
  setVisible,
  align = "left",
  vAlign = "top",
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
      <div onClick={open} className="w-fit">
        {mainPart}
      </div>
      {visible && (
        <div
          ref={hiddenRef}
          className={clsx(
            "absolute top-full z-10 my-1 rounded-sm border-2 bg-neutral-900 p-2 font-bold text-neutral-200 dark:border-neutral-800 dark:bg-neutral-900",
            align === "right" && "right-0",
            vAlign === "center" && "-translate-y-1/2"
          )}
        >
          {hiddenPart}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
