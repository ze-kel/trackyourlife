import type { ITrackable } from "@t/trackable";
import { getBaseUrl } from "src/helpers/getBaseUrl";

export const getTrackable = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: "GET",
  });

  const data = (await res.json()) as unknown;

  return data as ITrackable;
};
