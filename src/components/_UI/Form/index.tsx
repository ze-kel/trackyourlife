import clsx from "clsx";
import React, { useState } from "react";
import { z } from "zod";
import Button from "../Button";

export interface IFormItemText {
  key: string;
  type: "string";
  defaultValue: string;
  placeholder?: string;
  title?: string | React.ReactNode;
  inputType?: "password" | "email" | "text" | "search";
  schema: z.ZodString;
  className?: string;
}

export type IFormItem = IFormItemText;

export interface IForm {
  onSubmit: (v: Record<string, IFormItem["defaultValue"]>) => void;
  items: IFormItem[];
  submitButtonText: string;
}

interface IInputProps extends IFormItemText {
  onChange: (v: string) => void;
  isValid: boolean;
  error: string;
  value: string;
}

const GenericInput = ({
  value,
  placeholder,
  title,
  onChange,
  inputType,
  className,
  isValid,
  error,
}: IInputProps) => {
  return (
    <div className={className}>
      {title && (
        <h5 className="text-lg font-semibold text-neutral-800">{title}</h5>
      )}
      <input
        className={clsx(
          "mt-1 w-full rounded-sm border-2 border-neutral-300 py-1 px-2 outline-none transition-colors focus:border-neutral-800",
          isValid && "border-lime-500 focus:border-lime-600",
          error && "border-red-500 focus:border-red-600"
        )}
        type={inputType}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-red-500">{error}</div>
    </div>
  );
};

const getStartingData = (items: IForm["items"]) => {
  const data: Record<string, IFormItem["defaultValue"]> = {};
  items.forEach((i) => {
    data[i.key] = i.defaultValue || "";
  });
  return data;
};

type TFieldStatus = { isValidated: boolean; error: string };

const getStartingStatuses = (items: IForm["items"]) => {
  const data: Record<string, TFieldStatus> = {};
  items.forEach((i) => {
    data[i.key] = { isValidated: false, error: "" };
  });
  return data;
};

const Form = ({ onSubmit, items, submitButtonText }: IForm) => {
  const [data, setData] = useState(getStartingData(items));
  const [statuses, setStatuses] = useState(getStartingStatuses(items));

  const handleChange = (
    key: string,
    value: IFormItem["defaultValue"],
    validator: IFormItem["schema"]
  ) => {
    setData({ ...data, [key]: value });
    const res = validator.safeParse(value);
    let status: TFieldStatus;
    if (res.success) {
      status = { isValidated: true, error: "" };
    } else {
      status = { isValidated: false, error: res.error.errors[0].message };
    }
    setStatuses({ ...statuses, key: status });
  };

  const submitActive = Object.values(statuses).reduce(
    (acc, v) => v.isValidated && acc,
    true
  );

  const submit = () => {
    if (!submitActive) return;
    onSubmit(data);
  };

  return (
    <div>
      {items.map((formItem) => {
        if (formItem.type === "string")
          return (
            <GenericInput
              {...formItem}
              value={data[formItem.key]}
              error={statuses[formItem.key].error}
              isValid={statuses[formItem.key].isValidated}
              onChange={(v: string) =>
                handleChange(formItem.key, v, formItem.schema)
              }
            />
          );
      })}

      <Button isActive={submitActive} onClick={submit}>
        {" "}
        {submitButtonText}
      </Button>
    </div>
  );
};

export default Form;
