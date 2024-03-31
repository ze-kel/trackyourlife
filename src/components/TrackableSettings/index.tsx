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
import { useEffect, useRef, useState } from "react";
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
import { DayCellProvider } from "@components/Providers/DayCellProvider";
import { DayCellBoolean } from "@components/DayCell/DayCellBoolean";
import { DayCellNumber } from "@components/DayCell/DayCellNumber";
import { DayCellRange } from "@components/DayCell/DayCellRange";
import { DayCellBaseClasses } from "@components/DayCell";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { getDateInTimezone } from "src/helpers/timezone";
import { useUserSettings } from "@components/Providers/UserSettingsProvider";

export const SettingsBoolean = ({
  settings,
  notifyAboutChange,
}: {
  settings: MutableRefObject<IBooleanSettings>;
  notifyAboutChange: () => void;
}) => {
  return (
    <>
      <div>
        <h3 className="mb-2 text-xl">Checked color</h3>
        <DrawerMobileTitleProvider title="Checked color">
          <ColorInput
            value={settings.current.activeColor || presetsMap.green}
            onChange={(v) => {
              settings.current.activeColor = v;
              notifyAboutChange();
            }}
          />
        </DrawerMobileTitleProvider>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Unchecked color</h3>
        <DrawerMobileTitleProvider title="Unchecked color">
          <ColorInput
            value={settings.current.inactiveColor || presetsMap.neutral}
            onChange={(v) => {
              settings.current.inactiveColor = v;
              notifyAboutChange();
            }}
          ></ColorInput>
        </DrawerMobileTitleProvider>
      </div>
    </>
  );
};

export const SettingsNumber = ({
  settings,
  notifyAboutChange,
}: {
  settings: MutableRefObject<INumberSettings>;
  notifyAboutChange: () => void;
}) => {
  return (
    <>
      <div>
        <h3 className="text-xl">Progress</h3>

        <NumberLimitsSelector
          enabled={settings.current.progressEnabled}
          onEnabledChange={(v) => (settings.current.progressEnabled = v)}
          value={settings.current.progress}
          onChange={(v) => {
            settings.current.progress = v;
            notifyAboutChange();
          }}
          className="mt-2"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl">Color coding</h3>
        <NumberColorSelector
          enabled={settings.current.colorCodingEnabled}
          onEnabledChange={(v) => {
            settings.current.colorCodingEnabled = v;
            notifyAboutChange();
          }}
          value={settings.current.colorCoding}
          onChange={(v) => {
            settings.current.colorCoding = v;
            notifyAboutChange();
          }}
        />
      </div>
    </>
  );
};

export const SettingsRange = ({
  settings,
  notifyAboutChange,
}: {
  settings: MutableRefObject<IRangeSettings>;
  notifyAboutChange: () => void;
}) => {
  return (
    <>
      <div>
        <h3 className="mb-2 text-xl">States</h3>
        <RangeLabelSelector
          initialValue={settings.current.labels}
          onChange={(v) => {
            settings.current.labels = v;
            notifyAboutChange();
          }}
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
              notifyAboutChange();
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
              notifyAboutChange();
            }}
          />
          <Label htmlFor="is-cycle">Cycle to empty</Label>
        </div>
      </div>
    </>
  );
};

const TrackableMock = ({
  type,
  settings,
  signal,
  mockLabel,
}: {
  type: ITrackable["type"];
  settings: ITrackable["settings"];
  signal: TinySignal;
  mockLabel: string;
}) => {
  const [value, onChange] = useState("");

  const classes = cn(DayCellBaseClasses, "h-20");

  const [key, changeKey] = useState(0);

  useEffect(() => {
    return signal.subscribe(() => {
      changeKey(key + 1);
    });
  });

  const Label = (
    <div className="absolute left-0.5 top-0.5 select-none text-neutral-800 sm:left-1 sm:top-0 sm:text-base">
      <span className={"font-light"}>{mockLabel}</span>
    </div>
  );

  return (
    <div key={key} className="relative w-full">
      <DayCellProvider type={type} settings={settings}>
        {type === "boolean" && (
          <DayCellBoolean className={classes} value={value} onChange={onChange}>
            {Label}
          </DayCellBoolean>
        )}
        {type === "number" && (
          <DayCellNumber
            className={classes}
            dateDay={new Date()}
            value={value}
            onChange={onChange}
          >
            {Label}
          </DayCellNumber>
        )}
        {type === "range" && (
          <DayCellRange className={classes} value={value} onChange={onChange}>
            {Label}
          </DayCellRange>
        )}
      </DayCellProvider>
    </div>
  );
};

export class TinySignal {
  subscribers: Record<string, () => void>;

  constructor() {
    this.subscribers = {};
  }

  subscribe(callback: () => unknown) {
    const uuid = uuidv4();

    this.subscribers[uuid] = callback;

    return () => {
      delete this.subscribers[uuid];
    };
  }

  notifyAboutChange() {
    Object.values(this.subscribers).forEach((v) => v());
  }
}

const TrackableSettings = ({
  trackable,
  handleSave,
  customSaveButtonText,
  isLoadingButton,
}: {
  trackable: ITrackable | ITrackableUnsaved;
  handleSave: (v: ITrackable["settings"]) => void | Promise<void>;
  customSaveButtonText?: string;
  isLoadingButton?: boolean;
}) => {
  // Settings is a ref to avoid rerendering everything on every change(problematic with color inputs where you drag to change)
  // However we do need to update preview trackable, so with changing ref we also trigger signal update
  const signal = useRef(new TinySignal());
  const settings = useRef(trackable.settings);

  const u = useUserSettings();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl">Preview</h3>
      <div className="grid h-20  grid-cols-3 gap-1 md:grid-cols-6">
        {Array(6)
          .fill("")
          .map((_, i) => {
            return (
              <TrackableMock
                key={i}
                mockLabel={String(i + 1)}
                signal={signal.current}
                type={trackable.type}
                settings={settings.current}
              />
            );
          })}
      </div>
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
            limits={{
              start: new Date(1990, 0, 1),
              end: getDateInTimezone(u.settings.timezone),
            }}
            className="mt-2"
          />
        </DrawerMobileTitleProvider>
      </div>

      {trackable.type === "boolean" && (
        <SettingsBoolean
          notifyAboutChange={() => signal.current.notifyAboutChange()}
          settings={settings}
        />
      )}
      {trackable.type === "number" && (
        <SettingsNumber
          settings={settings}
          notifyAboutChange={() => signal.current.notifyAboutChange()}
        />
      )}
      {trackable.type === "range" && (
        <SettingsRange
          settings={settings}
          notifyAboutChange={() => signal.current.notifyAboutChange()}
        />
      )}

      {handleSave && (
        <Button
          isLoading={isLoadingButton}
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
