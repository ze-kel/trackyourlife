import type { TextInputProps } from "react-native";
import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "~/utils/cn";

export interface InputProps extends TextInputProps {
  isValid?: boolean;
  error?: string | boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, isValid, error, ...props }, ref) => {
    return (
      <TextInput
        className={cn(
          "flex w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
          /*   className,
          isValid && "border-lime-500 dark:border-lime-600",
          error && "border-red-500 dark:border-red-600",*/
        )}
        autoCorrect={false}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
