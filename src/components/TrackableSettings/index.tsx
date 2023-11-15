"use client";
import DatePicker from "@components/DatePicker";
import type {
  IBooleanSettings,
  INumberSettings,
  IRangeSettings,
  ITrackable,
  ITrackableUnsaved,
} from "@t/trackable";
import type { MutableRefObject } from "react";
import { useRef } from "react";
import NumberColorSelector from "../Colors/numberColorSelector";
import NumberLimitsSelector from "./numberLimitsSelector";
import RangeLabelSelector from "./rangeLabelSelector";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { presetsMap } from "@components/Colors/presets";
import ColorInput from "@components/Colors/colorInput";
import { Button } from "@/components/ui/button";

export const SettingsBoolean = ({
  settings,
}: {
  settings: MutableRefObject<IBooleanSettings>;
}) => {
  return (
    <>
      <div>
        <h3 className="mb-2 text-xl">Checked color</h3>
        <ColorInput
          value={settings.current.activeColor || presetsMap.green}
          onChange={(v) => (settings.current.activeColor = v)}
        ></ColorInput>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Unchecked color</h3>
        <ColorInput
          value={settings.current.inactiveColor || presetsMap.neutral}
          onChange={(v) => (settings.current.inactiveColor = v)}
        ></ColorInput>
      </div>
    </>
  );
};

export const SettingsNumber = ({
  settings,
}: {
  settings: MutableRefObject<INumberSettings>;
}) => {
  return (
    <>
      <div>
        <h3 className="text-xl">Limits</h3>
        <NumberLimitsSelector
          value={settings.current.limits}
          onChange={(v) => (settings.current.limits = v)}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Color coding</h3>
        <NumberColorSelector
          value={
            settings.current.colorCoding || [
              { point: 0, color: presetsMap.red, id: uuidv4() },
              { point: 100, color: presetsMap.green, id: uuidv4() },
            ]
          }
          onChange={(v) => (settings.current.colorCoding = v)}
        />
      </div>
    </>
  );
};

export const SettingsRange = ({
  settings,
}: {
  settings: MutableRefObject<IRangeSettings>;
}) => {
  return (
    <>
      <h3 className="mb-2 text-xl">Range Labels</h3>
      <RangeLabelSelector
        initialValue={settings.current.labels}
        onChange={(v) => (settings.current.labels = v)}
      />
    </>
  );
};

const TrackableSettings = ({
  trackable,
  handleSave,
  customSaveButtonText,
}: {
  trackable: ITrackable | ITrackableUnsaved;
  handleSave: (v: ITrackable["settings"]) => void | Promise<void>;
  customSaveButtonText?: string;
}) => {
  const settings = useRef(trackable.settings);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-xl">Name</h3>
        <Input
          placeholder="name"
          className="mt-2 w-fit"
          defaultValue={settings.current.name}
          onChange={(e) => (settings.current.name = e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl">Tracking Start</h3>
        <DatePicker
          date={
            settings.current.startDate
              ? new Date(settings.current.startDate)
              : undefined
          }
          onChange={(v) => (settings.current.startDate = String(v))}
          limits={{ start: new Date(1990, 0, 1), end: new Date() }}
          className="mt-2"
        />
      </div>

      {trackable.type === "boolean" && <SettingsBoolean settings={settings} />}
      {trackable.type === "number" && <SettingsNumber settings={settings} />}
      {trackable.type === "range" && <SettingsRange settings={settings} />}

      {handleSave && (
        <Button
          className="mt-2"
          variant={"outline"}
          onClick={() => void handleSave(settings.current)}
        >
          {customSaveButtonText || "Save"}
        </Button>
      )}
    </div>
  );
};

export default TrackableSettings;
