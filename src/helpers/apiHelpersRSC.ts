"use server";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { type ITrackable } from "src/types/trackable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getPageSession from "src/helpers/getPageSesion";
import { log } from "console";
import { and, eq } from "drizzle-orm";
import { db } from "src/app/api/db";
import { trackable } from "src/schema";

export type ITrackableBasic = Omit<ITrackable, "data">;

export const getTrackableIds = async () => {
  const res = await fetch(`${getBaseUrl()}/api/trackables`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
    next: {
      revalidate: 0,
    },
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const data = (await res.json()) as unknown;

  const result = data as { trackables: ITrackable[] };

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

export const deleteTrackable = async (id: string) => {
  const session = await getPageSession();
  if (!session?.user.userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;

  await db
    .delete(trackable)
    .where(and(eq(trackable.userId, userId), eq(trackable.id, id)));

  log(`API: Trackable Delete ${id}`);
  redirect("/");
};
