import Button from "@components/_UI/Button";
import DatePicker from "@components/_UI/DatePicker";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTrackableSafe } from "src/helpers/trackableContext";
import ColorSelector from "./colorSelector";

const SettingsBoolean = () => {
  const { trackable, changeSettings } = useTrackableSafe();

  if (trackable.type !== "boolean") {
    throw new Error("Not boolean trackable passed to boolean settings");
  }

  const router = useRouter();

  const [settings, setSettings] = useState(trackable.settings);

  const handleSave = async () => {
    await changeSettings(settings);
    await router.push(`/trackable/${trackable.id}`);
  };

  const changeActiveColor = (color: (typeof settings)["activeColor"]) => {
    setSettings({ ...settings, activeColor: color });
  };

  const chaneInactiveColor = (color: (typeof settings)["inactiveColor"]) => {
    setSettings({ ...settings, inactiveColor: color });
  };

  const changeStartDate = (date: (typeof settings)["startDate"]) => {
    setSettings({ ...settings, startDate: date });
  };

  return (
    <div className="flex flex-col">
      <h3 className="mt-4 text-xl">Tracking Start</h3>
      <DatePicker
        date={settings.startDate}
        onChange={changeStartDate}
        limits={{ start: new Date(1990, 0, 1), end: new Date() }}
        className="my-1"
      />

      <h3 className="text-xl">Checked color</h3>
      <ColorSelector
        active={settings.activeColor || "green"}
        onChange={changeActiveColor}
        className="my-2"
      />

      <h3 className="mt-4 text-xl">Unchecked color</h3>
      <ColorSelector
        active={settings.inactiveColor || "neutral"}
        onChange={chaneInactiveColor}
        className="my-2"
      />
      <Button className="mt-4" onClick={() => void handleSave()}>
        Save
      </Button>
    </div>
  );
};

const SettingsNumber = () => {
  return <>Number Settings</>;
};

const SettingsRange = () => {
  return <>Number Settings</>;
};

const TrackableSettings = () => {
  const { trackable } = useTrackableSafe();

  if (trackable.type === "boolean") {
    return <SettingsBoolean />;
  }

  if (trackable.type === "number") {
    return <SettingsNumber />;
  }

  if (trackable.type === "range") {
    return <SettingsRange />;
  }

  return <></>;
};

export default TrackableSettings;
