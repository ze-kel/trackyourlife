import type {
  IBooleanSettings,
  INumberSettings,
  IRangeSettings,
} from "src/helpers/settingsVerifier";

export type IFullData<T> = Record<string, string>;

export type ITrackableUnsaved =
  | {
      type: "boolean";
      settings: IBooleanSettings;
      data: Record<string, string>;
    }
  | {
      type: "number";
      settings: INumberSettings;
      data: Record<string, string>;
    }
  | {
      type: "range";
      settings: IRangeSettings;
      data: Record<string, string>;
    };

export type ITrackable = ITrackableUnsaved & { id: string };

export type ITrackableUpdate = {
  id: ITrackable["id"];
  day: number;
  month: number;
  year: number;
  value: string;
};
