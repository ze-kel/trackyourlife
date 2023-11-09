"use client";
import { Button } from "@/components/ui/button";
import DatePicker from "@components/_UI/DatePicker";
import type {
  IBooleanSettings,
  INumberSettings,
  IRangeSettings,
  ITrackable,
  ITrackableUnsaved,
} from "@t/trackable";
import { useState } from "react";
import NumberColorSelector from "./numberColorSelector";
import NumberLimitsSelector from "./numberLimitsSelector";
import RangeLabelSelector from "./rangeLabelSelector";
import { Input } from "@/components/ui/input";
import { RSAUpdateTrackableSettings } from "src/app/api/trackables/serverActions";

import { presetsMap } from "@components/_UI/ColorPicker/presets";
import ColorInput from "@components/_UI/ColorPicker/colorInput";

interface ISubSettingsProps<T> {
  settings: T;
  setSettings: (v: Partial<T>) => void;
  handleSave?: () => Promise<void>;
}

const SettingsBoolean = ({
  settings,
  setSettings,
  handleSave,
}: ISubSettingsProps<IBooleanSettings>) => {
  const changeName = (v: (typeof settings)["name"]) => {
    setSettings({ ...settings, name: v });
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
        <h3 className="text-xl">Name</h3>
        <Input
          placeholder="name"
          className="mt-2 w-fit"
          value={settings.name}
          onChange={(e) => changeName(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate ? new Date(settings.startDate) : undefined}
          onChange={(v) => changeStartDate(String(v))}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Checked color</h3>
        <ColorInput
          value={settings.activeColor || presetsMap.green}
          onChange={changeActiveColor}
        ></ColorInput>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Unchecked color</h3>
        <ColorInput
          value={settings.inactiveColor || presetsMap.neutral}
          onChange={chaneInactiveColor}
        ></ColorInput>
      </div>

      {handleSave && (
        <Button
          variant={"outline"}
          className="mt-2"
          onClick={() => void handleSave()}
        >
          Save
        </Button>
      )}
    </div>
  );
};

const SettingsNumber = ({
  settings,
  setSettings,
  handleSave,
}: ISubSettingsProps<INumberSettings>) => {
  const changeName = (v: (typeof settings)["name"]) => {
    setSettings({ ...settings, name: v });
  };

  const changeStartDate = (v: (typeof settings)["startDate"]) => {
    setSettings({ ...settings, startDate: v });
  };

  const changeColorCoding = (v: (typeof settings)["colorCoding"]) => {
    setSettings({ ...settings, colorCoding: v });
  };
  const changeLimits = (v: (typeof settings)["limits"]) => {
    setSettings({ ...settings, limits: v });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-xl">Name</h3>
        <Input
          placeholder="name"
          className="mt-2 w-fit"
          value={settings.name}
          onChange={(e) => changeName(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate ? new Date(settings.startDate) : undefined}
          onChange={(v) => changeStartDate(String(v))}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="text-xl">Limits</h3>
        <NumberLimitsSelector
          value={settings.limits}
          onChange={changeLimits}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Color coding</h3>
        <NumberColorSelector
          initialValue={settings.colorCoding}
          onChange={changeColorCoding}
        />
      </div>

      {handleSave && (
        <Button
          variant={"outline"}
          className="mt-2"
          onClick={() => void handleSave()}
        >
          Save
        </Button>
      )}
    </div>
  );
};

const SettingsRange = ({
  settings,
  setSettings,
  handleSave,
}: ISubSettingsProps<IRangeSettings>) => {
  const changeName = (v: (typeof settings)["name"]) => {
    setSettings({ ...settings, name: v });
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
        <h3 className="text-xl">Name</h3>
        <Input
          placeholder="name"
          className="mt-2 w-fit"
          value={settings.name}
          onChange={(e) => changeName(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={settings.startDate ? new Date(settings.startDate) : undefined}
          onChange={(v) => changeStartDate(String(v))}
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

      {handleSave && (
        <Button
          className="mt-2"
          variant={"outline"}
          onClick={() => void handleSave()}
        >
          Save
        </Button>
      )}
    </div>
  );
};

const TrackableSettings = ({ trackable }: { trackable: ITrackable }) => {
  const [settings, setSettings] = useState(trackable.settings);

  const handleSave = async () => {
    await RSAUpdateTrackableSettings({
      trackableId: trackable.id,
      data: settings,
      redirectToTrackablePage: true,
    });
  };

  if (trackable.type === "boolean") {
    return (
      <SettingsBoolean
        settings={settings}
        setSettings={setSettings}
        handleSave={handleSave}
      />
    );
  }

  if (trackable.type === "number") {
    return (
      <SettingsNumber
        settings={settings}
        setSettings={setSettings}
        handleSave={handleSave}
      />
    );
  }

  if (trackable.type === "range") {
    return (
      <SettingsRange
        settings={settings}
        setSettings={setSettings}
        handleSave={handleSave}
      />
    );
  }

  return <></>;
};

export const TrackableSettingsManual = ({
  trackable,
  setSettings,
}: {
  trackable: ITrackable | ITrackableUnsaved;
  setSettings: (v: ITrackable["settings"]) => void;
}) => {
  const settings = trackable.settings;

  if (trackable.type === "boolean") {
    return <SettingsBoolean settings={settings} setSettings={setSettings} />;
  }

  if (trackable.type === "number") {
    return <SettingsNumber settings={settings} setSettings={setSettings} />;
  }

  if (trackable.type === "range") {
    return <SettingsRange settings={settings} setSettings={setSettings} />;
  }

  return <></>;
};

export default TrackableSettings;
