import type { NextRequest } from "next/server";
import { auth } from "src/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export const checkForSession = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  return { session, authRequest, userId: session?.user.userId };
};

export const RSAGetUserIdAndRedirect = async () => {
  const id = await RSAGetUserId();
  if (id === null) {
    redirect("/login");
  }

  return id;
};

export const RSAGetUserId = async () => {
  const authRequest = auth.handleRequest("GET", context);

  const session = await authRequest.validate();
  if (!session?.user.userId) {
    return null;
  }

  return session.user.userId;
};

export class ApiFunctionError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
