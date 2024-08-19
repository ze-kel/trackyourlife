import type { Metadata } from "next";

import "../styles/globals.css";

import type { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { validateRequest } from "@tyl/auth";
import { cn } from "@tyl/ui";
import { UserSettingsFallback } from "@tyl/validators/user";

import Header from "~/components/Header";
import QueryProvider from "~/components/Providers/QueryProvider";
import { ThemeProvider } from "~/components/Providers/ThemeProvider";
import UserSettingsProvider from "~/components/Providers/UserSettingsProvider";
import { Sidebar } from "~/components/Sidebar";
import { api } from "~/trpc/server";
import { LazyMotionProvider } from "../components/Providers/lazyFramerMotionProvider";
import m from "./layout.module.css";

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
  const { user } = await validateRequest();

  const userSettings = await fetchUserSettingsIfPossible();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ReactQueryDevtools />
          <UserSettingsProvider initialSettings={userSettings}>
            <LazyMotionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div
                  className={cn(
                    "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
                    user && m.wrapperGrid,
                  )}
                >
                  <div className="bg sticky top-0 z-[999] col-span-2 flex h-14 justify-center border-b-2 border-neutral-300 bg-neutral-100 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                    <Header user={user || undefined} />
                  </div>
                  {user && (
                    <div className="sidebar customScrollBar customScrollBarBig sticky top-14 hidden h-full max-h-[calc(100vh-3.5rem)] overflow-auto border-r-2 border-neutral-300 bg-neutral-100 px-3 py-6 dark:border-neutral-800 dark:bg-neutral-900 xl:block">
                      <Sidebar />
                    </div>
                  )}
                  <div className="mx-auto box-border w-full pt-6 max-xl:col-span-2">
                    {children}
                  </div>
                </div>
              </ThemeProvider>
            </LazyMotionProvider>
          </UserSettingsProvider>
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
