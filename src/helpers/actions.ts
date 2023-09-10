"use server";
import type { ITrackableSettings, ITrackableUpdate } from "@t/trackable";
import { ZTrackableUpdate } from "@t/trackable";
import { revalidatePath } from "next/cache";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { headers } from "next/headers";

type IChangeDay = (update: ITrackableUpdate) => Promise<ITrackableUpdate>;

export const changeDay: IChangeDay = async (update) => {
  const h = headers();

  const res = await fetch(`${getBaseUrl()}/api/trackables/${update.id}`, {
    method: "POST",
    body: JSON.stringify(update),
    headers: { Cookie: h.get("Cookie") || "", Origin: h.get("Origin") || "" },
  });

  const data = (await res.json()) as unknown;

  revalidatePath(`${getBaseUrl()}/api/trackables/${update.id}`);

  const checked = ZTrackableUpdate.parse(data);

  return checked;
};

export const updateSettings = async ({
  id,
  settings,
}: {
  id: string;
  settings: ITrackableSettings;
}) => {
  const h = headers();
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}/settings`, {
    method: "POST",
    body: JSON.stringify(settings),
    headers: { Cookie: h.get("Cookie") || "", Origin: h.get("Origin") || "" },
  });

  const data = (await res.json()) as unknown;

  revalidatePath(`${getBaseUrl()}/api/trackables/${id}`);

  return data as ITrackableSettings;
};

export const deleteTrackable = async (id: string) => {
  const h = headers();

  await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: "DELETE",
    headers: { Cookie: h.get("Cookie") || "", Origin: h.get("Origin") || "" },
  });
};
