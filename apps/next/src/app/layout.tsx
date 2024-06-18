import type { Metadata } from "next";

import "../styles/globals.css";

import type { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { validateRequest } from "@tyl/auth";
import { cn } from "@tyl/ui";

import Header from "~/components/Header";
import QueryProvider from "~/components/Providers/QueryProvider";
import { ThemeProvider } from "~/components/Providers/ThemeProvider";
import UserSettingsProvider from "~/components/Providers/UserSettingsProvider";
import { Sidebar } from "~/components/Sidebar";
import { api } from "~/trpc/server";
import { LazyMotionProvider } from "../components/Providers/lazyFramerMotionProvider";
import m from "./layout.module.css";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  const userSettigns = await api.userRouter.getUserSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ReactQueryDevtools />
          <UserSettingsProvider initialSettings={userSettigns}>
            <LazyMotionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div
                  className={cn(
                    "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
                    m.wrapperGrid,
                  )}
                >
                  <div className="bg sticky top-0 z-[999] col-span-2 flex h-14 justify-center border-b-2 border-neutral-300 bg-neutral-100 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                    <Header user={user || undefined} />
                  </div>
                  <div className="sidebar sticky top-14 hidden h-full max-h-[calc(100vh-3.5rem)] overflow-scroll border-r-2 border-neutral-300 bg-neutral-100 px-3 py-6 dark:border-neutral-800 dark:bg-neutral-900 xl:block">
                    {user && <Sidebar />}
                  </div>
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
  icons: {
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    icon: "/favicon-32x32.png",
  },
};
