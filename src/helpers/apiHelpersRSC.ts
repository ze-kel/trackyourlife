import { getBaseUrl } from "src/helpers/getBaseUrl";
import { type ITrackable } from "src/types/trackable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ITrackableBasic = Omit<ITrackable, "data">;

export const getTrackableIds = async () => {
  const res = await fetch(`${getBaseUrl()}/api/trackables`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const data = (await res.json()) as unknown;

  const result = data as { trackables: ITrackable[] };

  console.log(result.trackables[0]?.settings);

  return result.trackables;
};

export const getTrackable = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const data = (await res.json()) as unknown;

  return data as ITrackable;
};
