import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useColorScheme } from "nativewind";

import { useSession } from "~/app/authContext";

export default function AppLayout() {
  const { userData } = useSession();

  const { colorScheme } = useColorScheme();
  if (!userData) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
        },
      }}
    />
  );
}
