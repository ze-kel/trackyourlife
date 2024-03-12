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
import { presetsMap } from "@components/Colors/presets";
import ColorInput from "@components/Colors/colorInput";
import { Button } from "@/components/ui/button";
import { DrawerMobileTitleProvider } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const SettingsBoolean = ({
  settings,
}: {
  settings: MutableRefObject<IBooleanSettings>;
}) => {
  return (
    <>
      <div>
        <h3 className="mb-2 text-xl">Checked color</h3>
        <DrawerMobileTitleProvider title="Checked color">
          <ColorInput
            value={settings.current.activeColor || presetsMap.green}
            onChange={(v) => (settings.current.activeColor = v)}
          />
        </DrawerMobileTitleProvider>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Unchecked color</h3>
        <DrawerMobileTitleProvider title="Unchecked color">
          <ColorInput
            value={settings.current.inactiveColor || presetsMap.neutral}
            onChange={(v) => (settings.current.inactiveColor = v)}
          ></ColorInput>
        </DrawerMobileTitleProvider>
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
        <h3 className="text-xl">Progress</h3>

        <NumberLimitsSelector
          enabled={settings.current.progressEnabled}
          onEnabledChange={(v) => (settings.current.progressEnabled = v)}
          value={settings.current.progress}
          onChange={(v) => (settings.current.progress = v)}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Color coding</h3>
        <NumberColorSelector
          enabled={settings.current.colorCodingEnabled}
          onEnabledChange={(v) => (settings.current.colorCodingEnabled = v)}
          value={settings.current.colorCoding}
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
      <div>
        <h3 className="mb-2 text-xl">States</h3>
        <RangeLabelSelector
          initialValue={settings.current.labels}
          onChange={(v) => (settings.current.labels = v)}
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Cycle values</h3>
        <div className="mt-1 flex items-center space-x-2">
          <Switch
            id="is-cycle"
            defaultChecked={settings.current.isCycle}
            onCheckedChange={(v) => {
              settings.current.isCycle = v;
            }}
          />
          <Label htmlFor="is-cycle">Select next label on click</Label>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <Switch
            id="is-cycle"
            defaultChecked={settings.current.cycleToEmpty}
            onCheckedChange={(v) => {
              settings.current.cycleToEmpty = v;
            }}
          />
          <Label htmlFor="is-cycle">Cycle to empty</Label>
        </div>
      </div>
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
    <div className="flex flex-col gap-4">
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
        <DrawerMobileTitleProvider title="Tracking Start">
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
        </DrawerMobileTitleProvider>
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
