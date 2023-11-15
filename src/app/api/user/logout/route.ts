import { auth } from "src/auth/lucia";
import type { NextRequest } from "next/server";
import { checkForSession } from "src/app/api/helpers";

export const POST = async (request: NextRequest) => {
  const { session, authRequest } = await checkForSession(request);
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login", // redirect to login page
    },
  });
};
