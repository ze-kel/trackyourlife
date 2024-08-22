import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "~/app/authContext";
import { api } from "~/utils/api";

export default function Index() {
  const { signOut } = useSession();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await api.trackablesRouter.getTrackableIdList.query();
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>You are logged in </Text>

      <Text>{JSON.stringify(data)}</Text>
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
