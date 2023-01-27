import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { z } from "zod";

interface IBase {
  value?: string;
  placeholder?: string;
  type?: "password" | "email" | "text" | "search" | "number";
  className?: string;
}

interface IPureInputProps extends IBase {
  onChange: (v: ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  error?: string;
}

interface IInputProps extends IBase {
  title?: string;
  schema?: z.ZodString;
  onChange: (v: string) => void;
}

export const PureInput = ({
  value,
  placeholder,
  type,
  onChange,
  isValid,
  error,
  className,
}: IPureInputProps) => {
  return (
    <>
      <input
        className={clsx(
          className,
          "transition-color w-full rounded-sm border-2 border-neutral-300 bg-neutral-50 py-1 px-2 outline-none focus:border-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-600",
          isValid &&
            "border-lime-500 focus:border-lime-600 dark:border-lime-500 dark:focus:border-lime-600",
          error &&
            "border-red-500 focus:border-red-600 dark:border-red-500 dark:focus:border-red-600"
        )}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <div className="text-red-500">{error}</div>
    </>
  );
};

const GenericInput = ({
  value,
  placeholder,
  title,
  onChange,
  type,
  schema,
  className,
}: IInputProps) => {
  const [val, setVal] = useState(value || "");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (val: string) => {
    setVal(val);

    if (!schema) {
      onChange(val);
      return;
    }

    const res = schema.safeParse(val);
    if (res.success) {
      onChange(val);
      setError("");
      setIsValid(true);
    } else {
      if (res.error.errors[0]) {
        setError(res.error.errors[0].message);
      }
      setIsValid(false);
    }
  };

  return (
    <div className={className}>
      {title && (
        <h5 className="mb-1 text-lg font-semibold text-neutral-800 dark:text-neutral-300">
          {title}
        </h5>
      )}
      <PureInput
        isValid={isValid}
        error={error}
        type={type}
        value={val}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default GenericInput;
