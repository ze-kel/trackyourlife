import clsx from "clsx";
import type { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: ReactNode;
  theme?: "default" | "inverted";
  size?: "s" | "m";
  className?: string;
  fill?: boolean;
}

const themes = {
  default: {
    base: "text-neutral-50 bg-neutral-900 hover:bg-neutral-900 cursor-pointer",
    inactive:
      "cursor-default text-neutral-200 bg-neutral-700 hover:bg-neutral-700",
  },
  inverted: {
    base: "text-neutral-900 bg-neutral-100 hover:bg-neutral-50 cursor-pointer",
    inactive: "",
  },
};

const sizes = {
  s: "text-sm py-1 px-2 rounded",
  m: "text-md py-2 px-4 font-semibold rounded-md",
};
const Button = ({
  onClick,
  isActive = true,
  children,
  theme = "default",
  size = "m",
  className,
  fill,
}: ButtonProps) => {
  const handleClick = () => {
    if (isActive) {
      onClick();
    }
  };

  const currentTheme = themes[theme];
  const currentSize = sizes[size];

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "max-h-full transition-colors",
        currentTheme.base,
        currentSize,
        !isActive && currentTheme.inactive,
        className,
        fill && "w-full"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
