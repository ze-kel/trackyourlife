import { useState, ChangeEvent, useEffect, useRef, useContext } from "react";
import { TrackableContext } from "./trackableContext";

const TrackableName = () => {
  const { trackable, changeSettings } = useContext(TrackableContext);

  const [editMode, setEditMode] = useState(false);
  const [inputVal, setInputVal] = useState(trackable.settings.name);
  const [waiting, setWaiting] = useState(false);
  const [focusNext, setFocusNext] = useState(false);

  const goToEdit = () => {
    setInputVal(trackable.settings.name);
    setEditMode(true);
    setFocusNext(true);
  };

  const save = async () => {
    if (waiting) return;
    setWaiting(true);
    await changeSettings({ name: inputVal });
    setEditMode(false);
    setWaiting(false);
  };

  const handelEdit = (e: ChangeEvent<HTMLInputElement>) => {
    if (waiting) return;
    setInputVal(e.target.value);
  };

  useEffect(() => {
    if (!focusNext || !inputRef.current) return;

    inputRef.current.focus();
    setFocusNext(false);
  }, [focusNext]);

  const inputRef = useRef<HTMLInputElement>();

  if (editMode) {
    return (
      <input
        ref={inputRef}
        value={inputVal}
        onChange={handelEdit}
        onBlur={save}
        className="w-full border-b border-slate-800 text-2xl focus:border-b focus:outline-none"
      />
    );
  }

  return (
    <h1
      onClick={goToEdit}
      className="cursor-text border-b border-transparent text-2xl"
    >
      {trackable.settings.name}
    </h1>
  );
};

export default TrackableName;
