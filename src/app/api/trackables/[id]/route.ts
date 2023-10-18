import { NextResponse, type NextRequest } from "next/server";

import { ApiFunctionError, checkForSession } from "src/app/api/helpers";
import {
  DeleteTrackable,
  GetTrackable,
  UpdateTrackable,
} from "src/app/api/trackables/apiFunctions";

// GET DATA
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { userId } = await checkForSession(request);

  if (!userId) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  try {
    const trackable = await GetTrackable({ trackableId: params.id, userId });
    return NextResponse.json(trackable);
  } catch (e) {
    if (e instanceof ApiFunctionError) {
      return NextResponse.json({}, { status: e.code, statusText: e.message });
    }
    return NextResponse.json({}, { status: 500, statusText: "Unknown errror" });
  }
};

// UPDATE
export const POST = async (request: NextRequest) => {
  const { userId } = await checkForSession(request);

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  try {
    const data = (await request.json()) as unknown;

    const result = await UpdateTrackable({ data, userId });

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ApiFunctionError) {
      return NextResponse.json({}, { status: e.code, statusText: e.message });
    }
    return NextResponse.json({}, { status: 500, statusText: "Unknown errror" });
  }
};

// DELETE TRACKABLE
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { userId } = await checkForSession(request);
  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  try {
    const id = params.id;
    await DeleteTrackable({ trackableId: id, userId });

    return NextResponse.redirect(request.nextUrl.origin);
  } catch (e) {
    if (e instanceof ApiFunctionError) {
      return NextResponse.json({}, { status: e.code, statusText: e.message });
    }
    return NextResponse.json({}, { status: 500, statusText: "Unknown errror" });
  }
};
