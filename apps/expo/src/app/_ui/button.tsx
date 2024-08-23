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
  "flex items-center justify-center rounded-md border border-transparent opacity-100 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 dark:bg-neutral-50",
        destructive: "bg-red-500 dark:bg-red-900",
        outline:
          "border border-neutral-200 bg-transparent dark:border-neutral-800",
        secondary: "bg-neutral-100 dark:bg-neutral-800",
        ghost: "",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-8",
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
        className={cn(buttonVariants({ variant, size, className }))}
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
