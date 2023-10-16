import { getBaseUrl } from "src/helpers/getBaseUrl";
import type { ITrackableUnsaved } from "src/types/trackable";
import {
  ZTrackableUpdate,
  type ITrackable,
  type ITrackableUpdate,
} from "src/types/trackable";
import type { IUserSettings } from "@t/user";
import { revalidatePath } from "next/cache";

export const getTrackable = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: "GET",
  });

  const data = (await res.json()) as unknown;

  return data as ITrackable;
};

export type IChangeSettings = (
  someSettings: Partial<ITrackable["settings"]>,
) => Promise<void>;

type IChangeDay = (update: ITrackableUpdate) => Promise<ITrackableUpdate>;

export const updateTrackable: IChangeDay = async (update) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${update.id}`, {
    method: "POST",
    body: JSON.stringify(update),
  });

  const data = (await res.json()) as unknown;

  const checked = ZTrackableUpdate.parse(data);

  return checked;
};

export const createTrackable = async (newOne: ITrackableUnsaved) => {
  await fetch(`${getBaseUrl()}/api/trackables`, {
    method: "PUT",
    body: JSON.stringify(newOne),
  });
};

export const deleteTrackable = async (id: string) => {
  await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: "DELETE",
  });

  revalidatePath("/api/trackables");

  revalidatePath("/");
};

export const updateSettings = async (update: IUserSettings) => {
  const res = await fetch(`${getBaseUrl()}/user/settings`, {
    method: "POST",
    body: JSON.stringify(update),
  });
  const data = (await res.json()) as unknown;
  return data as IUserSettings;
};
