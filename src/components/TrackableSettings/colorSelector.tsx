import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import clsx from "clsx";
import type { IColorOptions } from "src/types/trackable";

const options = [
  {
    value: "neutral",
    label: "bg-neutral-500",
  },
  {
    value: "green",
    label: "bg-green-500",
  },
  {
    value: "lime",
    label: "bg-lime-500",
  },
  {
    value: "red",
    label: "bg-red-500",
  },
  {
    value: "blue",
    label: "bg-blue-500",
  },
  {
    value: "purple",
    label: "bg-purple-500",
  },
  {
    value: "pink",
    label: "bg-pink-500",
  },
  {
    value: "orange",
    label: "bg-orange-500",
  },
];

const ColorSelector = ({
  active,
  onChange,
  className,
}: {
  active?: IColorOptions;
  onChange: (v: IColorOptions) => void;
  className?: string;
}) => {
  return (
    <RadioGroup
      className={clsx("flex gap-2", className)}
      value={active}
      onValueChange={(v) => onChange(v as IColorOptions)}
    >
      {options.map((opt) => (
        <RadioGroupItem
          key={opt.value}
          value={opt.value}
          className={clsx(
            "h-8 w-8 rounded-md border-2 border-transparent transition-colors",
            opt.label,
            "data-[state=checked]:border-neutral-700 data-[state=checked]:dark:border-neutral-200",
          )}
        />
      ))}
    </RadioGroup>
  );
};

export default ColorSelector;
