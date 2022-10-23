import cls from "clsx";

export interface ISelectorOption {
  label: JSX.Element | string;
  value: any;
}

const Selector = ({
  options,
  active,
  setter,
}: {
  options: ISelectorOption[];
  active: any;
  setter: (arg0: any) => void;
}) => {
  return (
    <div className="flex w-fit overflow-hidden rounded-md">
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={cls(
              "px-2 py-1  transition-colors",
              active === option.value
                ? "cursor-default bg-zinc-800 text-zinc-50"
                : "cursor-pointer bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
            )}
            onClick={() => setter(option.value)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export default Selector;
