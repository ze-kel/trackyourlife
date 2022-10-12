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
    <div className="flex w-fit overflow-hidden rounded-md border">
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={cls(
              "cursor-pointer bg-slate-200 px-2 py-1",
              active === option.value &&
                "cursor-default bg-slate-800 text-white"
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
