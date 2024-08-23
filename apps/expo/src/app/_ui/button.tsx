import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import * as React from "react";
import { Pressable, Text } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";
import Spinner, { ISpinnerColor } from "./spinner";

const textVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-neutral-50 dark:text-neutral-900",
      destructive: "text-neutral-50 dark:text-neutral-50",
      outline: "",
      secondary: "",
      ghost: "",
    },
    size: {
      default: "text-lg font-bold",
      sm: "text-xs",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 shadow dark:bg-neutral-50",
        destructive: "bg-red-500 shadow-sm dark:bg-red-900",
        outline:
          "border border-neutral-200 bg-transparent shadow-sm dark:border-neutral-800",
        secondary: "bg-neutral-100 shadow-sm dark:bg-neutral-800",
        ghost: "",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  icon?: boolean;
  leftIcon?: React.ReactNode;
  loading?: boolean;
}

type Variants = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

const spinnerColors: Record<Variants, ISpinnerColor> = {
  default: "white",
  destructive: "white",
  outline: "black",
  secondary: "black",
  ghost: "black",
};

//@ts-expect-error Pressable type
const Button = React.forwardRef<Pressable, ButtonProps>(
  (
    { className, loading, variant, size, children, icon, leftIcon, ...props },
    ref,
  ) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size, className }), className)}
        style={{}}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Spinner color={spinnerColors[variant || "default"]} width={20} />
        ) : (
          <>
            {leftIcon ? leftIcon : <></>}

            {icon ? (
              children
            ) : (
              <Text className={textVariants({ variant, size })}>
                {children as ReactNode}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  },
);
Button.displayName = "Button";

export { Button };
