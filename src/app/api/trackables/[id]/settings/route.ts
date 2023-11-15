import { NextResponse, type NextRequest } from "next/server";

import { checkForSession } from "src/app/api/helpers";
import { UpdateTrackableSettings } from "src/app/api/trackables/apiFunctions";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { userId } = await checkForSession(request);

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const trackableId = params.id;

  const data = (await request.json()) as unknown;

  const result = await UpdateTrackableSettings({ data, trackableId, userId });

  return NextResponse.json(result);
};
