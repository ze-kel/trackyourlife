"use server";

import { redirect } from "next/navigation";
import { RSAGetUserIdAndRedirect } from "src/app/api/helpers";
import {
  CreateTrackable,
  DeleteTrackable,
  GetAllTrackables,
  GetTrackable,
  GetTrackableData,
  GetTrackableSettings,
  GetTrackablesIdList,
  UpdateTrackable,
  UpdateTrackableName,
  UpdateTrackableSettings,
} from "src/app/api/trackables/apiFunctions";

import type { TGETLimits } from "@tyl/validators/api";
import type {
  ITrackable,
  ITrackableSettings,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "@tyl/validators/trackable";

export const RSAGetAllTrackables = async ({
  limits,
}: {
  limits?: TGETLimits;
}) => {
  const userId = await RSAGetUserIdAndRedirect();
  return await GetAllTrackables({ userId, limits });
};

export const RSAGetTrackablesIdList = async () => {
  const userId = await RSAGetUserIdAndRedirect();
  return await GetTrackablesIdList({ userId });
};

export const RSAGetTrackable = async ({
  trackableId,
  limits,
}: {
  trackableId: ITrackable["id"];
  limits?: TGETLimits;
}) => {
  const userId = await RSAGetUserIdAndRedirect();
  return await GetTrackable({ trackableId, userId, limits });
};

export const RSAGetTrackableSettings = async ({
  trackableId,
}: {
  trackableId: ITrackable["id"];
}) => {
  const userId = await RSAGetUserIdAndRedirect();
  return await GetTrackableSettings({ trackableId, userId });
};

export const RSAGetTrackableData = async ({
  trackableId,
  limits,
}: {
  trackableId: ITrackable["id"];
  limits: TGETLimits;
}) => {
  const userId = await RSAGetUserIdAndRedirect();
  return await GetTrackableData({ trackableId, userId, limits });
};

export const RSACreateTrackable = async (data: ITrackableUnsaved) => {
  const userId = await RSAGetUserIdAndRedirect();
  const result = await CreateTrackable({ data, userId });
  redirect("/trackables/" + result.id);
};

export const RSAUpdateTrackable = async (data: ITrackableUpdate) => {
  const userId = await RSAGetUserIdAndRedirect();

  const result = await UpdateTrackable({ data, userId });

  return result;
};

export const RSADeleteTrackable = async (trackableId: ITrackable["id"]) => {
  const userId = await RSAGetUserIdAndRedirect();
  await DeleteTrackable({ trackableId, userId });

  redirect("/");
};

export const RSAUpdateTrackableName = async (
  trackableId: ITrackable["id"],
  name: string,
) => {
  const userId = await RSAGetUserIdAndRedirect();
  return await UpdateTrackableName({ trackableId, userId, name });
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
  const userId = await RSAGetUserIdAndRedirect();

  const result = await UpdateTrackableSettings({ trackableId, data, userId });

  if (redirectToTrackablePage) {
    redirect("/trackables/" + trackableId);
  }
  return result;
};
