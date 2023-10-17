import type { NextRequest } from "next/server";
import { auth } from "src/auth/lucia";

export const checkForUser = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request);

  const session = await authRequest.validate();
  console.log("session", session);

  return session ? session.user.userId : null;
};

export const checkForSession = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request);

  const session = await authRequest.validate();

  return { session, authRequest };
};
