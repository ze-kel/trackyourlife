import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { lucia, validateRequest } from "src/auth/lucia";

export const POST = async (request: NextRequest) => {
  const { session } = await validateRequest();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login", // redirect to login page
    },
  });
};
