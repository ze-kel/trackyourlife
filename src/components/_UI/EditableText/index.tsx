import clsx from "clsx";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useState, useEffect, useRef } from "react";

interface IEditableTextBase {
  classNameInput?: string;
  classNameText?: string;
  className?: string;
  editModeSetter?: (val: boolean) => void;
}

interface IEditableTextDefaultProps extends IEditableTextBase {
  isNumber?: false;
  value?: string;
  updater: (val: string) => void | Promise<void>;
}

interface IEditableTextNumberProps extends IEditableTextBase {
  isNumber: true;
  value?: number;
  updater: (val: number) => void | Promise<void>;
}

type IEditableTextProps = IEditableTextDefaultProps | IEditableTextNumberProps;

const EditableText = ({
  isNumber,
  value,
  updater,
  className,
  classNameText,
  classNameInput,
  editModeSetter,
}: IEditableTextProps) => {
  const [editMode, setEditMode] = useState(false);
  const [inputVal, setInputVal] = useState(value);
  const [waiting, setWaiting] = useState(false);
  const [focusNext, setFocusNext] = useState(false);

  const goToEdit = (e: MouseEvent | FocusEvent) => {
    console.log("goToEdit");
    e.stopPropagation();
    setInputVal(value);
    if (editModeSetter) editModeSetter(true);
    setEditMode(true);
    setFocusNext(true);
  };

  const save = async () => {
    if (waiting) return;
    setWaiting(true);
    if (isNumber) {
      await updater(Number(inputVal));
    } else {
      //@ts-expect-error this is correct
      await updater(inputVal);
    }
    setEditMode(false);
    if (editModeSetter) editModeSetter(false);
    setWaiting(false);
  };

  const handelEdit = (e: ChangeEvent<HTMLInputElement>) => {
    if (waiting) return;
    setInputVal(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void save();
    }

    if (e.key === "Escape") {
      setEditMode(false);
    }
  };

  useEffect(() => {
    if (!focusNext || !inputRef.current) return;

    inputRef.current.focus();
    inputRef.current.select();
    setFocusNext(false);
  }, [focusNext]);

  const inputRef = useRef<HTMLInputElement>(null);

  if (editMode) {
    return (
      <input
        type={isNumber ? "number" : "text"}
        ref={inputRef}
        value={inputVal}
        onChange={handelEdit}
        onBlur={() => void save()}
        className={clsx(className, classNameInput)}
        onKeyUp={handleKeyUp}
      />
    );
  }

  return (
    <div
      tabIndex={0}
      onFocus={goToEdit}
      onClick={goToEdit}
      className={clsx(className, classNameText)}
    >
      {value}
    </div>
  );
};

export default EditableText;
