import clsx from "clsx";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";

interface ButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  children: ReactNode;
  theme?: "default" | "inverted" | "outline" | "transparent";
  size?: "s" | "m";
  className?: string;
  fill?: boolean;
}

const ButtonClasses = cva(
  ["active:cursor-pointer max-h-full transition-colors"],
  {
    variants: {
      theme: {
        default: [
          "text-neutral-50 bg-neutral-900 dark:bg-neutral-50 dark:text-neutral-900",
          "hover:bg-neutral-700, dark:hover:bg-neutral-300",
          "disabled:text-neutral-200 disabled:bg-neutral-700",
        ],
        inverted: [
          "text-neutral-900 bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-50",
          "hover:bg-neutral-200, dark:hover:bg-neutral-700",
          "disabled:text-neutral-700 disabled:bg-neutral-200",
        ],
        outline: [
          "text-neutral-900 border border-neutral-900 dark:border-neutral-50 dark:text-neutral-50",
          "hover:bg-neutral-900, dark:hover:bg-neutral-300 hover:text-neutral-50 dark:hover:text-neutral-900",
          "disabled:text-neutral-700 disabled:bg-neutral-200",
        ],
        transparent: [
          "hover:bg-neutral-200 dark:hover:bg-neutral-800",
          "hover:bg-neutral-200 dark:hover:bg-neutral-800",
          "disabled:text-neutral-700 disabled:bg-neutral-200",
        ],
      },
      size: {
        s: "text-sm py-1 px-2 font-normal",
        m: "text-md py-2 px-4 font-semibold rounded-md",
      },
      fill: {
        true: "w-full",
      },
    },
    defaultVariants: {
      theme: "default",
      size: "m",
    },
  }
);

const Button = ({
  onClick,
  isActive = true,
  children,
  theme,
  size,
  className,
  fill,
}: ButtonProps) => {
  const handleClick = () => {
    if (isActive && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(className, ButtonClasses({ theme, size, fill }))}
    >
      {children}
    </button>
  );
};

export default Button;
