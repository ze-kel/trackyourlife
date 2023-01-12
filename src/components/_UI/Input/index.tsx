import clsx from "clsx";
import { useState } from "react";
import type { z } from "zod";

interface IInputProps {
  value?: string;
  placeholder?: string;
  title?: string;
  type?: "password" | "email" | "text" | "search";
  onChange: (v: string) => void;
  schema: z.ZodString;
  className?: string;
}

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
    const res = schema.safeParse(val);
    if (res.success) {
      onChange(val);
      setError("");
      setIsValid(true);
    } else {
      setError(res.error.errors[0].message);
      setIsValid(false);
    }
  };

  return (
    <div className={className}>
      {title && (
        <h5 className="text-lg font-semibold text-zinc-800">{title}</h5>
      )}
      <input
        className={clsx(
          "mt-1 w-full rounded-sm border-2 border-zinc-300 py-1 px-2 outline-none transition-colors focus:border-zinc-800",
          isValid && "border-lime-500 focus:border-lime-600",
          error && "border-red-500 focus:border-red-600"
        )}
        type={type}
        value={val}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="text-red-500">{error}</div>
    </div>
  );
};

export default GenericInput;
