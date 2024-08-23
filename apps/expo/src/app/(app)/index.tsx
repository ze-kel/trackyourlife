import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { Button } from "~/app/_ui/button";
import { useSession } from "~/app/authContext";
import { db } from "~/db";
import { useSync } from "~/db/syncContext";
import { api } from "~/utils/api";

export default function Index() {
  const { signOut } = useSession();

  const { isLoading, lastSync, sync } = useSync();

  const { data } = useLiveQuery(db.query.trackable.findMany());

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>You are logged in </Text>

      <Text>Last sync {lastSync.toUTCString()}</Text>
      {isLoading && <Text>syncing</Text>}
      <Button variant={"default"} onPress={sync}>
        Sync
      </Button>

      <Text>{data.length} trackables</Text>
      <View>
        {data.map((v) => (
          <Text>{v.name}</Text>
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
