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
      {title && <h5 className="text-lg font-bold">{title}</h5>}
      <input
        className={clsx(
          "mt-1 w-full rounded-sm border-2 border-zinc-400 p-1 outline-none focus:border-zinc-800",
          isValid && "border-green-500 focus:border-green-600",
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
