import clsx from "clsx";

export interface IDropdown {
  isOpened: boolean;
  content: React.ReactNode[];
  className?: string;
}

const Dropdown = ({ isOpened, content, className }: IDropdown) => {
  if (!isOpened) return <></>;
  return (
    <div
      className={clsx(
        "absolute top-[110%] right-0 flex w-full flex-col rounded-md border border-neutral-400 bg-neutral-900 p-2",
        className
      )}
    >
      {content.map((c, i) => (
        <div key={i}>{c}</div>
      ))}
    </div>
  );
};

export default Dropdown;
