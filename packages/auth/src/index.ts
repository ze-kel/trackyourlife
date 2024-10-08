import type { Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { generateId, Lucia } from "lucia";
import { Argon2id } from "oslo/password";

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

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DbUserSelect;
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export { Session, User, generateId, Argon2id };
