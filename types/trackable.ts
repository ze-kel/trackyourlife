type IMonthData<T> = Record<number, T>;
type IYearData<T> = Record<number, IMonthData<T>>;
type IFullData<T> = Record<number, IYearData<T>>;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

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

export type ITrackableUpdate = Optional<
  ITrackable,
  "settings" | "data" | "type"
>;
