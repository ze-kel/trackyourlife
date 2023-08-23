import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { Input } from "../../../../@/components/ui/input";

interface IBase {
  value?: string;
  placeholder?: string;
  type?: "password" | "email" | "text" | "search" | "number";
  className?: string;
}

interface IPureInputProps extends IBase {
  onChange: (v: ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  error?: string | boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  onBlur,
}: IPureInputProps) => {
  return (
    <div className="flex flex-col">
      <Input
        className={clsx(
          className,
          isValid && "border-lime-500 dark:border-lime-600 ",
          error && "border-red-500 dark:border-red-600 ",
        )}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && typeof error === "string" && (
        <div className="mt-1 text-xs text-red-500 dark:text-red-600">
          {error}
        </div>
      )}
    </div>
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

  useEffect(() => {
    if (value) {
      handleChange(value);
    }
  }, []);

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
      onChange("");
    }
  };

  return (
    <div className={className}>
      {title && (
        <h5 className="mb-1 text-sm font-semibold text-neutral-800 dark:text-neutral-300">
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
