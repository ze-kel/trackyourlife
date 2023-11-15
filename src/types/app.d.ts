/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("../auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
    role: string | undefined;
  };
  type DatabaseSessionAttributes = object;
}
