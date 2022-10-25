import EditableText from "@components/_UI/EditableText";
import { useContext } from "react";
import { TrackableContext } from "../../helpers/trackableContext";

const TrackableName = () => {
  const { trackable, changeSettings } = useContext(TrackableContext);

  const handleUpdate = (name) => {
    changeSettings({ ...trackable.settings, name });
  };

  return (
    <EditableText
      value={trackable.settings.name}
      updater={handleUpdate}
      className="w-full text-2xl"
      classNameInput="outline-none"
    />
  );
};

export default TrackableName;
