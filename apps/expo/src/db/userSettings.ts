import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";

import {
  IUserSettings,
  UserSettingsFallback,
  ZUserSettings,
} from "@tyl/validators/user";

import { db } from "~/db";
import { meta, userData } from "~/db/schema";
import { proxy, ref, snapshot, subscribe } from "~/utils/proxy";

const USER_KEY = "all";

const userSettingsState = proxy({
  value: UserSettingsFallback as IUserSettings,
});

const useUserSettings = () => {
  const [state, setState] = useState(snapshot(userSettingsState).value);

  useEffect(() => {
    return subscribe(userSettingsState, () => {
      const s = snapshot(userSettingsState);
      setState(s.value);
    });
  }, []);

  return state;
};

const updateUserSettingsFromDb = () => {
  db.query.userData
    .findFirst({ where: eq(userData.user, USER_KEY) })
    .then((v) => {
      if (v?.settings) {
        const parsed = ZUserSettings.safeParse(v.settings);

        if (parsed.success) {
          userSettingsState.value = parsed.data;
        }
      }
    });
};

updateUserSettingsFromDb();

const updateUserSettings = (settings: IUserSettings) => {
  userSettingsState.value = settings;
};

export { useUserSettings, updateUserSettingsFromDb, updateUserSettings };
