import { IncomingMessage } from "http";
import type { Session, User } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { generateId, Lucia, verifyRequestOrigin } from "lucia";
import { Argon2id } from "oslo/password";
import {
  appendHeader,
  defineMiddleware,
  EventHandlerRequest,
  getCookie,
  getHeader,
  H3Event,
  setCookie,
} from "vinxi/server";

import type { DbUserSelect } from "@tyl/db/schema";
import { db } from "@tyl/db";
import { auth_user, user_session } from "@tyl/db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, user_session, auth_user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes(attributes) {
    return {
      username: attributes.username,
      email: attributes.email,
    };
  },
});

export const validateRequest = async (
  event: H3Event<EventHandlerRequest>,
): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      setCookie(
        event,
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      setCookie(
        event,
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
};

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DbUserSelect;
  }
}

export const middleware = defineMiddleware({
  onRequest: async (event) => {
    if (event.node.req.method !== "GET") {
      const originHeader = getHeader(event, "Origin") ?? null;
      const hostHeader = getHeader(event, "Host") ?? null;
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        event.node.res.writeHead(403).end();
        return;
      }
    }

    const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
    if (!sessionId) {
      event.context.session = null;
      event.context.user = null;
      return;
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session?.fresh) {
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
    }
    if (!session) {
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createBlankSessionCookie().serialize(),
      );
    }
    event.context.session = session;
    event.context.user = user;
  },
});

export { Session, User, generateId, Argon2id };
