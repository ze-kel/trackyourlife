import { Stack } from "expo-router";

import { tws } from "~/utils/tw";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: tws(
          "bg-neutral-50 dark:bg-neutral-950 shadow-none elevation-0",
        ),
        contentStyle: tws("bg-neutral-50 dark:bg-neutral-950"),
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
