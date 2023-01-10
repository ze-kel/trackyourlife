export type IFullData<T> = Record<string, string>;

interface BaseSettings {
  name?: string;
}

export type ITrackableUnsaved = {
  type: "range" | "number" | "boolean";
  settings: BaseSettings;
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
