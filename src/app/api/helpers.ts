import type { NextRequest } from "next/server";
import { auth } from "src/auth/lucia";
import * as context from "next/headers";


export const checkForSession = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  return { session, authRequest, userId: session?.user.userId };
};

export class ApiFunctionError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
