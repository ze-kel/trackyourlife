"use server";
import type { ITrackableSettings, ITrackableUpdate } from "@t/trackable";
import { ZTrackableUpdate } from "@t/trackable";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getBaseUrl } from "src/helpers/getBaseUrl";

type IChangeDay = (update: ITrackableUpdate) => Promise<ITrackableUpdate>;

export const changeDay: IChangeDay = async (update) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${update.id}`, {
    method: "POST",
    body: JSON.stringify(update),
    headers: {
      Cookie: cookies().toString(),
    },
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
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}/settings`, {
    method: "POST",
    body: JSON.stringify(settings),
    headers: {
      Cookie: cookies().toString(),
    },
  });
  const data = (await res.json()) as unknown;

  revalidatePath(`${getBaseUrl()}/api/trackables/${id}`);

  return data as ITrackableSettings;
};
