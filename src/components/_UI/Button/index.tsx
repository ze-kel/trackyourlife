import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonProps {
  click: () => void;
  isActive?: boolean;
  children: ReactNode;
  theme?: "default" | "inverted";
  className?: string;
  fill?: boolean;
}

const Button = ({
  click,
  isActive = true,
  children,
  theme = "default",
  className,
  fill,
}: ButtonProps) => {
  const handleClick = () => {
    if (isActive) {
      click();
    }
  };

  const themes = {
    default: {
      base: "text-zinc-50 bg-zinc-800 hover:bg-zinc-900 cursor-pointer",
      inactive: "cursor-default text-zinc-200 bg-zinc:600",
    },
    inverted: {
      base: "text-zinc-900 bg-zinc-100 hover:bg-zinc-50 cursor-pointer",
      inactive: "",
    },
  };

  const currentTheme = themes[theme];

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "text-md max-h-full rounded-md py-2 px-4 font-semibold transition-colors",
        currentTheme.base,
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
