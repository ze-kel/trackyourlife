import { ScrollView, Text, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHookstate } from "@hookstate/core";

import { Button } from "~/app/_ui/button";
import { currentUser, currentUserInfo, useSession } from "~/data/authContext";
import { isSyncing, lastSync, sync } from "~/data/syncContext";
import { tws } from "~/utils/tw";

const SyncInfo = ({ style }: { style?: ViewStyle }) => {
  const ls = useHookstate(lastSync);
  const isInProgress = useHookstate(isSyncing);

  const lsTime = ls.get();

  return (
    <View style={[tws("w-full"), style]}>
      <Text style={tws("text-sm text-neutral-700 dark:text-neutral-300")}>
        Last sync: {lsTime ? lsTime.toLocaleString() : "never"}
      </Text>
      <View style={tws("flex flex-row gap-2 mt-2")}>
        <Button
          style={tws("grow")}
          loading={isInProgress.get()}
          variant={"outline"}
          onPress={() => sync()}
        >
          Sync
        </Button>

        <Button
          loading={isInProgress.get()}
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
  const u = useHookstate(currentUser);
  const uState = useHookstate(currentUserInfo);
  const { signOut } = useSession();
  return (
    <>
      <Text style={tws("text-color-base font-bold")}>
        Host: <Text style={tws("font-medium opacity-70")}>{u.get()?.host}</Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        Username:{" "}
        <Text style={tws("font-medium opacity-70")}>
          {uState.username.get()}
        </Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        Email:{" "}
        <Text style={tws("font-medium opacity-70")}>{uState.email.get()}</Text>
      </Text>
      <Text style={tws("text-color-base font-bold")}>
        ID: <Text style={tws("font-medium opacity-70")}>{u.get()?.userId}</Text>
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
