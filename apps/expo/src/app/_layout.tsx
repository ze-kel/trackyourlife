import "@bacons/text-decoder/install";

import { Text, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDeviceContext } from "twrnc";

import { SessionProvider } from "~/data/authContext";
import { db } from "~/db";
import migrations from "~/drizzle/migrations";
import { tw, tws } from "~/utils/tw";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  useDeviceContext(tw);
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={tws("flex h-full w-full items-center justify-center p-4")}>
        <Text style={tws("text-2xl")}>Migration error</Text>
        <Text style={tws(" mt-2 text-center")}>
          We tried to apply migrations to local db, but encountered an error.
        </Text>
      </View>
    );
  }

  if (!success) {
    <View style={tws("flex h-full w-full items-center justify-center p-4")}>
      <Text style={tws(" text-center")}>
        Applying migrations to local db, this shouldn't take long
      </Text>
    </View>;
  }

  return (
    <GestureHandlerRootView>
      <PortalProvider>
        <BottomSheetModalProvider>
          <SessionProvider>
            <PortalHost name="rangePortal" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: tws("bg-neutral-50 dark:bg-neutral-950"),
              }}
            />
            <StatusBar />
          </SessionProvider>
        </BottomSheetModalProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
