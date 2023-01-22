import cls from "clsx";

export interface ISelectorOption<T> {
  label: JSX.Element | string;
  value: T;
}

export type ISelectorComponentProps<T> = {
  active: boolean;
  option: ISelectorOption<T>;
  onClick: (v: T) => void;
};

export type ISelectorComponent<T> = ({
  active,
  option,
}: ISelectorComponentProps<T>) => JSX.Element;

interface ISectorProps<T> {
  options: ISelectorOption<T>[];
  active?: T;
  setter: (v: T) => void;
  Component: ISelectorComponent<T>;
  className?: string;
}

function DefaultSub<T>({
  active,
  option,
  onClick,
}: ISelectorComponentProps<T>) {
  return (
    <div
      className={cls(
        "px-2 py-1  transition-colors",
        active
          ? "cursor-default bg-neutral-800 text-neutral-50"
          : "cursor-pointer bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
      )}
      onClick={() => onClick(option.value)}
    >
      {option.label}
    </div>
  );
}

function Selector<T>({
  options,
  active,
  setter,
  Component = DefaultSub,
  className = "flex w-fit overflow-hidden rounded-md",
}: ISectorProps<T>) {
  return (
    <div className={className}>
      {options.map((option, index) => {
        return (
          <Component
            key={index}
            active={option.value === active}
            option={option}
            onClick={setter}
          />
        );
      })}
    </div>
  );
}

export default Selector;
