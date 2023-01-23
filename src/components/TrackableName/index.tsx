import EditableText from "@components/_UI/EditableText";
import { useTrackableSafe } from "../../helpers/trackableContext";

const TrackableName = () => {
  const { trackable, changeSettings } = useTrackableSafe();

  const handleUpdate = (name: string) => {
    void changeSettings({ ...trackable.settings, name });
  };

  return (
    <EditableText
      value={trackable.settings.name}
      updater={handleUpdate}
      className="w-full bg-inherit text-2xl font-semibold"
      classNameInput="outline-none"
    />
  );
};

export default TrackableName;
