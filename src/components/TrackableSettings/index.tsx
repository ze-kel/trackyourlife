import Button from "@components/_UI/Button";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { TrackableContext } from "src/helpers/trackableContext";
import ColorSelector from "./colorSelector";

const SettingsBoolean = () => {
  const { trackable, changeSettings } = useContext(TrackableContext) ?? {};
  if (!trackable || !changeSettings) {
    throw new Error("Context error: Trackable Settings");
  }
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

  return (
    <div className="flex flex-col">
      <h3 className="text-xl">Checked color</h3>
      <ColorSelector
        active={settings.activeColor || "green"}
        onChange={changeActiveColor}
        className="my-2"
      />

      <h3 className="text-xl">Unchecked color</h3>
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
  const { trackable } = useContext(TrackableContext) ?? {};

  if (!trackable) {
    throw new Error("Context error: Trackable Settings");
  }

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
