import { NextResponse, type NextRequest } from "next/server";
import { checkForSession } from "src/app/api/helpers";
import {
  CreateTrackable,
  GetAllTrackables,
} from "src/app/api/trackables/apiFunctions";

export const GET = async () => {
  const { userId } = await checkForSession();

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const trackables = await GetAllTrackables({ userId });

  return NextResponse.json({ trackables });
};

export const PUT = async (request: NextRequest) => {
  const { userId } = await checkForSession();

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = (await request.json()) as unknown;

  const result = await CreateTrackable({ data, userId });

  const url = request.nextUrl.clone();
  url.pathname = `trackables/${result.id}`;

  return NextResponse.redirect(url);
};
