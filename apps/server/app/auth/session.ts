// app/services/session.server.ts
import { useSession } from "vinxi/http";

export type SessionUser = {
  email: string;
  id: string;
  username: string;
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: "ChangeThisBeforeShippingToProdOrYouWillBeFired",
  });
}
