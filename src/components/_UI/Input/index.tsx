import { useEffect, useState } from "react";
import type { z } from "zod";
import { Input } from "@/components/ui/input";

interface IBase {
  value?: string;
  placeholder?: string;
  type?: "password" | "email" | "text" | "search" | "number";
  className?: string;
}

interface IInputProps extends IBase {
  title?: string;
  schema?: z.ZodString;
  onChange: (v: string) => void | string;
  noError?: boolean;
  updateFromOnchage?: boolean;
}

const GenericInput = ({
  value,
  placeholder,
  title,
  onChange,
  type,
  schema,
  className,
  noError,
  updateFromOnchage,
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
      if (updateFromOnchage) {
        setVal(onChange(val) as string);
      } else {
        onChange(val);
      }
      setError("");
      setIsValid(true);
    } else {
      if (res.error.errors[0] && !noError) {
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
      <Input
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
