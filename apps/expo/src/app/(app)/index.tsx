import { useState } from "react";
import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getDateInTimezone } from "@tyl/helpers/timezone";
import {
  ITrackable,
  ITrackableSettings,
  ZTrackableSettings,
} from "@tyl/validators/trackable";

import { DayCellBoolean } from "~/app/_components/dayCellBoolean";
import { DayCellProvider } from "~/app/_components/dayCellProvider";
import {
  TrackableProvider,
  useTrackableContextSafe,
} from "~/app/_components/trackableProvider";
import { Button } from "~/app/_ui/button";
import { useSession } from "~/app/authContext";
import { db } from "~/db";
import { useSync } from "~/db/syncContext";

export const makeTrackableSettings = (trackable: unknown) => {
  const parseRes = ZTrackableSettings.safeParse(trackable);
  if (parseRes.success) {
    return parseRes.data;
  }
  return {};
};

const Today = () => {
  const now = new Date();
  const d = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
  );
  const { useValue, setValue, settings, name } = useTrackableContextSafe();
  const { value, error } = useValue(d);

  return (
    <DayCellProvider type="boolean" settings={settings}>
      <DayCellBoolean value={value} onChange={(v) => setValue(d, v)}>
        <Text>{name}</Text>
      </DayCellBoolean>
    </DayCellProvider>
  );
};

export default function Index() {
  const { signOut } = useSession();

  const { isLoading, lastSync, sync } = useSync();

  const { data } = useLiveQuery(db.query.trackable.findMany());
  const [value, setValue] = useState("true");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text className="">You are logged in </Text>

      <Text>Last sync {lastSync.toUTCString()}</Text>
      {isLoading && <Text>syncing</Text>}
      <Button variant={"default"} onPress={() => sync()}>
        Sync
      </Button>

      <Button variant={"default"} onPress={() => sync(true)}>
        Sync clear
      </Button>

      <Text>
        {data.length} trackables {value}
      </Text>
      <View>
        {data.map((v) => (
          <View key={v.id} className="mt-2">
            {v.type === "boolean" && (
              <TrackableProvider trackable={v}>
                <Today />
              </TrackableProvider>
            )}
          </View>
        ))}
      </View>

      <Text
        onPress={() => {
          signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
