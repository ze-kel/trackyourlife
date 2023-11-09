"use server";

import type {
  ITrackable,
  ITrackableSettings,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "@t/trackable";
import {
  CreateTrackable,
  DeleteTrackable,
  GetAllTrackables,
  GetTrackable,
  UpdateTrackable,
  UpdateTrackableSettings,
} from "src/app/api/trackables/apiFunctions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { TGETLimits } from "src/app/api/trackables/apiHelpers";
import { RSAGetUserId } from "src/app/api/helpers";

export const RSAGetAllTrackables = async ({
  limits,
}: {
  limits?: TGETLimits;
}) => {
  const userId = await RSAGetUserId();
  return await GetAllTrackables({ userId, limits });
};

export const RSAGetTrackable = async ({
  trackableId,
  limits,
}: {
  trackableId: ITrackable["id"];
  limits?: TGETLimits;
}) => {
  const userId = await RSAGetUserId();
  return await GetTrackable({ trackableId, userId, limits });
};

export const RSACreateTrackable = async (data: ITrackableUnsaved) => {
  const userId = await RSAGetUserId();
  const result = await CreateTrackable({ data, userId });
  redirect("/trackables/" + result.id);
};

export const RSAUpdateTrackable = async (data: ITrackableUpdate) => {
  const userId = await RSAGetUserId();

  const result = await UpdateTrackable({ data, userId });
  revalidatePath(`/trackables/${result.id}`);

  return result;
};

export const RSADeleteTrackable = async (trackableId: ITrackable["id"]) => {
  const userId = await RSAGetUserId();
  await DeleteTrackable({ trackableId, userId });

  redirect("/");
};

export const RSAUpdateTrackableSettings = async ({
  trackableId,
  data,
  redirectToTrackablePage,
}: {
  trackableId: ITrackable["id"];
  data: ITrackableSettings;
  redirectToTrackablePage?: boolean;
}) => {
  const userId = await RSAGetUserId();

  const result = await UpdateTrackableSettings({ trackableId, data, userId });

  revalidatePath(`/trackables/${trackableId}`);
  revalidatePath(`/`);

  if (redirectToTrackablePage) {
    redirect("/trackables/" + trackableId);
  }
  return result;
};
