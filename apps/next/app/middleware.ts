import { middleware, Session, User } from "@tyl/auth";

export default middleware;

declare module "vinxi/server" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
