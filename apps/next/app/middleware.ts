import { middleware, Session, User } from "@tyl/auth";

export default middleware;

// Native vinxi events
declare module "vinxi/server" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}

// Hack for trpc createHTTPHandler which uses native node req object
declare module "http" {
  interface IncomingMessage {
    context: {
      user: User | null;
      session: Session | null;
    };
  }
}
