import type { TextInputProps } from "react-native";
import * as React from "react";
import { TextInput } from "react-native";

import { tw, tws } from "~/utils/tw";

export interface InputProps extends TextInputProps {
  isValid?: boolean;
  error?: string | boolean;
}

export const InputStyle = (...v: string[]) =>
  tws(
    "flex h-12 w-full items-center justify-center rounded-lg border px-2 py-0",
    "text-neutral-950 dark:text-neutral-50",
    "border-neutral-200 placeholder:text-neutral-500 disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400",
  );

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, isValid, error, ...props }, ref) => {
    return (
      <TextInput
        style={[InputStyle(), style]}
        autoCorrect={false}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
