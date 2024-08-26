import type { Metadata } from "next";

import "../styles/globals.css";

import type { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { validateRequest } from "@tyl/auth";
import { cn } from "@tyl/ui";
import { UserSettingsFallback } from "@tyl/validators/user";

import QueryProvider from "~/components/Providers/QueryProvider";
import { ThemeProvider } from "~/components/Providers/ThemeProvider";
import UserProvider from "~/components/Providers/UserProvider";
import { api } from "~/trpc/server";
import { LazyMotionProvider } from "../components/Providers/lazyFramerMotionProvider";

const fetchUserSettingsIfPossible = async () => {
  try {
    const userSettings = await api.userRouter.getUserSettings();
    return userSettings;
  } catch (e) {
    return UserSettingsFallback;
  }
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, session } = await validateRequest();

  const userSettings = await fetchUserSettingsIfPossible();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ReactQueryDevtools />
          <UserProvider
            initialSettings={userSettings}
            user={user}
            session={session}
          >
            <LazyMotionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </LazyMotionProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "TrackYourLife",
  description: "TrackYourLifeApp",
  icons:
    process.env.SITE === "stage"
      ? {
          shortcut: "/stg/favicon.ico",
          apple: "/stg/apple-touch-icon.png",
          icon: "/stg/favicon-32x32.png",
        }
      : {
          shortcut: "/favicon.ico",
          apple: "/apple-touch-icon.png",
          icon: "/favicon-32x32.png",
        },
};
