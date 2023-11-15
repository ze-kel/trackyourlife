import { auth } from "./../auth/lucia";
import { cache } from "react";
import * as context from "next/headers";

const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);

  return authRequest.validate();
});

export default getPageSession;
