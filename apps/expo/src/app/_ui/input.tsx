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
          "flex h-12 w-full items-center justify-center rounded-lg border px-2 py-0 transition-colors",
          "border-neutral-200 placeholder:text-neutral-500 disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400",
          className,
        )}
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
          lineHeight: 22,
        }}
        autoCorrect={false}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
