import "@bacons/text-decoder/install";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useColorScheme } from "nativewind";

import migrations from "~/drizzle/migrations";

import "../styles.css";

import type { ReactNode } from "react";
import { useState } from "react";
import { Text, View } from "react-native";

import { SessionProvider } from "~/app/authContext";
import { db } from "~/db";
import { SyncContextProvider } from "~/db/syncContext";

function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex h-full w-full items-center justify-center p-4">
        <Text className="text-2xl">Migration error</Text>
        <Text className="text-md mt-2 text-center">
          We tried to apply migrations to local db, but encountered an error.
        </Text>
      </View>
    );
  }

  if (!success) {
    <View className="flex h-full w-full items-center justify-center p-4">
      <Text className="text-md text-center">
        Applying migrations to local db, this shouldn't take long
      </Text>
    </View>;
  }

  return (
    <SessionProvider>
      <QueryProvider>
        <SyncContextProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
              },
            }}
          />
          <StatusBar />
        </SyncContextProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
