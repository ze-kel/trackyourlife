import { ScrollView, Text, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/app/_ui/button";
import { useSession } from "~/app/authContext";
import { sync, useSyncState } from "~/db/syncContext";
import { tws } from "~/utils/tw";

const SyncInfo = ({ style }: { style?: ViewStyle }) => {
  const syncState = useSyncState();

  return (
    <View style={[tws("w-full"), style]}>
      <Text style={tws("text-sm text-neutral-700 dark:text-neutral-300")}>
        Last sync: {syncState.lastSync.toLocaleString()}
      </Text>
      <View style={tws("flex flex-row gap-2 mt-2")}>
        <Button
          style={tws("grow")}
          loading={syncState.isSyncing}
          variant={"outline"}
          onPress={() => sync()}
        >
          Sync
        </Button>

        <Button
          loading={syncState.isSyncing}
          variant={"destructive"}
          onPress={() => sync(true)}
        >
          Full refetch
        </Button>
      </View>
    </View>
  );
};

const UserInfo = () => {
  const { signOut, userData } = useSession();
  return (
    <>
      <Text style={tws("text-color-base font-bold")}>
        Host:{" "}
        <Text style={tws("font-medium opacity-70")}>{userData?.host}</Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        Username:{" "}
        <Text style={tws("font-medium opacity-70")}>{userData?.username}</Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        Email:{" "}
        <Text style={tws("font-medium opacity-70")}>{userData?.email}</Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        ID:{" "}
        <Text style={tws("font-medium opacity-70")}>{userData?.userId}</Text>
      </Text>
      <Button style={tws("mt-2")} variant={"outline"} onPress={signOut}>
        Log Out
      </Button>
    </>
  );
};

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tws("px-4")}>
          <Text style={tws("text-color-base text-4xl font-extrabold mb-4")}>
            Settings
          </Text>
          <Text style={tws("text-color-base text-3xl font-bold")}>User</Text>
          <UserInfo />

          <Text style={tws("text-color-base text-3xl font-bold mt-4")}>
            Sync
          </Text>

          <SyncInfo style={tws("mt-2")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
