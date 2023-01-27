import type {
  ISelectorComponentProps,
  ISelectorOption,
} from "@components/_UI/Selector";
import Selector from "@components/_UI/Selector";
import clsx from "clsx";
import type { IColorOptions } from "src/types/trackable";

const options: ISelectorOption<IColorOptions>[] = [
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
    <Selector
      options={options}
      active={active}
      setter={onChange}
      Component={Color}
      className={clsx("flex gap-2", className)}
    />
  );
};

const Color = ({
  active,
  onClick,
  option,
}: ISelectorComponentProps<IColorOptions>) => {
  return (
    <div
      onClick={() => onClick(option.value)}
      className={clsx(
        "h-8 w-8 rounded-full border-2 border-transparent transition-colors",
        option.label,
        active ? "border-neutral-50" : "cursor-pointer"
      )}
    />
  );
};

export default ColorSelector;
