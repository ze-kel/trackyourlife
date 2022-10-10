export type IFullData<T> = Record<string, T>;

interface BaseSettings {
  name: string;
}

export interface ITrackableBoolean {
  type: "boolean";
  settings: BaseSettings;
  data: IFullData<boolean>;
}

export interface ITrackableNumber {
  type: "number";
  settings: BaseSettings;
  data: IFullData<number>;
}

export interface ITrackableRange {
  type: "range";
  settings: BaseSettings & { labels: Record<string, string> };
  data: IFullData<string>;
}

export type ITrackableUnsaved =
  | ITrackableBoolean
  | ITrackableNumber
  | ITrackableRange;

export type ITrackable = ITrackableUnsaved & { id: string };

// Probably should be forced to provide correct type
export type ITrackableUpdate = {
  day: number;
  month: number;
  year: number;
  value: boolean | number | string;
};
