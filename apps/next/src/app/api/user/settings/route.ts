import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiFunctionError, checkForSession } from "src/app/api/helpers";
import {
  GetUserSettings,
  UpdateUserSettings,
} from "src/app/api/user/settings/apiFunctions";

export const GET = async () => {
  // Auth check
  const { userId } = await checkForSession();

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const settings = GetUserSettings({ userId });

  return NextResponse.json(settings);
};

export const POST = async (request: NextRequest) => {
  // Auth check
  const { userId } = await checkForSession();

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = (await request.json()) as unknown;

  try {
    const settings = await UpdateUserSettings({ data, userId });
    return NextResponse.json(settings);
  } catch (e) {
    if (e instanceof ApiFunctionError) {
      return NextResponse.json({}, { status: e.code, statusText: e.message });
    }
    return NextResponse.json({}, { status: 500, statusText: "Unknown errror" });
  }
};
