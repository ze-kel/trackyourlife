// app/services/session.server.ts
import { useSession } from "vinxi/http";

export function useAppSession() {
  return useSession({
    password: "ChangeThisBeforeShippingToProdOrYouWillBeFired",
  });
}
