import Button from "@components/_UI/Button";
import DatePicker from "@components/_UI/DatePicker";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTrackableSafe } from "src/helpers/trackableContext";
import ColorSelector from "./colorSelector";
import NumberColorSelector from "./numberColorSelector";
import RangeLabelSelector from "./rangeLabelSelector";

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

  const changeActiveColor = (v: (typeof settings)["activeColor"]) => {
    setSettings({ ...settings, activeColor: v });
  };

  const chaneInactiveColor = (v: (typeof settings)["inactiveColor"]) => {
    setSettings({ ...settings, inactiveColor: v });
  };

  const changeStartDate = (v: (typeof settings)["startDate"]) => {
    setSettings({ ...settings, startDate: v });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate}
          onChange={changeStartDate}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="text-xl">Checked color</h3>
        <ColorSelector
          active={settings.activeColor || "green"}
          onChange={changeActiveColor}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mt-4 text-xl">Unchecked color</h3>
        <ColorSelector
          active={settings.inactiveColor || "neutral"}
          onChange={chaneInactiveColor}
          className="mt-2"
        />
      </div>

      <Button className="mt-2" onClick={() => void handleSave()}>
        Save
      </Button>
    </div>
  );
};

const SettingsNumber = () => {
  const { trackable, changeSettings } = useTrackableSafe();

  if (trackable.type !== "number") {
    throw new Error("Not number trackable passed to number settings");
  }

  const router = useRouter();

  const [settings, setSettings] = useState(trackable.settings);

  const handleSave = async () => {
    await changeSettings(settings);
    await router.push(`/trackable/${trackable.id}`);
  };

  const changeStartDate = (v: (typeof settings)["startDate"]) => {
    setSettings({ ...settings, startDate: v });
  };

  const changeColorCoding = (v: (typeof settings)["colorCoding"]) => {
    setSettings({ ...settings, colorCoding: v });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate}
          onChange={changeStartDate}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Color coding</h3>
        <NumberColorSelector
          value={settings.colorCoding}
          onChange={changeColorCoding}
        />
      </div>

      <Button className="mt-2" onClick={() => void handleSave()}>
        Save
      </Button>
    </div>
  );
};

const SettingsRange = () => {
  const { trackable, changeSettings } = useTrackableSafe();

  if (trackable.type !== "range") {
    throw new Error("Not range trackable passed to range settings");
  }

  const router = useRouter();

  const [settings, setSettings] = useState(trackable.settings);

  const handleSave = async () => {
    await changeSettings(settings);
    await router.push(`/trackable/${trackable.id}`);
  };

  const changeStartDate = (v: (typeof settings)["startDate"]) => {
    setSettings({ ...settings, startDate: v });
  };

  const changeRangeLabels = (v: (typeof settings)["labels"]) => {
    setSettings({ ...settings, labels: v });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate}
          onChange={changeStartDate}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Range Labels</h3>
        <RangeLabelSelector
          initialValue={settings.labels}
          onChange={changeRangeLabels}
        />
      </div>

      <Button className="mt-2" onClick={() => void handleSave()}>
        Save
      </Button>
    </div>
  );
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
