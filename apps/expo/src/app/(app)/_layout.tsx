import { useColorScheme } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Redirect, Tabs } from "expo-router";
import { useHookstate } from "@hookstate/core";
import { RadixIcon } from "radix-ui-react-native-icons";

import { currentUser } from "~/data/authContext";
import { useSyncInterval } from "~/data/syncContext";
import { expoDb } from "~/db";
import { tws } from "~/utils/tw";

export default function AppLayout() {
  const user = useHookstate(currentUser);

  useSyncInterval();
  useDrizzleStudio(expoDb);

  const colorScheme = useColorScheme();
  if (!user.get()) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      sceneContainerStyle={tws("bg-neutral-50 dark:bg-neutral-950")}
      screenOptions={{
        headerStyle: tws(
          "bg-neutral-50 dark:bg-neutral-950 shadow-none elevation-0",
        ),
        headerShown: false,
        tabBarStyle: [
          tws(
            "bg-neutral-100 dark:bg-neutral-900 shadow-none elevation-0 border-t-0",
          ),
        ],
        tabBarActiveTintColor: colorScheme === "dark" ? "#f5f5f5" : "#171717",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Today",
          tabBarIcon: (v) => (
            <RadixIcon size={26} color={v.color} name="calendar" />
          ),
        }}
      />
      <Tabs.Screen
        name="trackables"
        options={{
          tabBarLabel: "Trackables",
          tabBarIcon: (v) => (
            <RadixIcon size={26} color={v.color} name="list-bullet" />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: (v) => (
            <RadixIcon size={26} color={v.color} name="gear" />
          ),
        }}
      />
    </Tabs>
  );
}
/*
<Tabs.Screen
  name="create"
  options={{
    tabBarLabel: "Create",
    tabBarIcon: (v) => (
      <RadixIcon size={26} color={v.color} name="plus-circled" />
    ),
  }}
/>
*/
