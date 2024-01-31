import { redirect } from "next/navigation";
import { validateRequest } from "src/auth/lucia";

export const checkForSession = async () => {
  const { session, user } = await validateRequest();

  return { session, user, userId: session?.userId };
};

export const RSAGetUserIdAndRedirect = async () => {
  const { userId } = await checkForSession();
  if (!userId) {
    redirect("/login");
  }

  return userId;
};

export class ApiFunctionError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
