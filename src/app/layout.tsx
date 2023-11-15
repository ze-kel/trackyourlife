import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@components/Providers/ThemeProvider";

import getPageSession from "src/helpers/getPageSesion";
import Header from "@components/Header";
import { LazyMotionProvider } from "../components/Providers/lazyFramerMotionProvider";
import type { ReactNode } from "react";
import UserSettingsProvider from "@components/Providers/UserSettingsProvider";
import { RSAGetUserSettings } from "src/app/api/user/settings/serverActions";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getPageSession();
  
  const userSettigns =  await RSAGetUserSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <UserSettingsProvider initialSettings={userSettigns}>
          <LazyMotionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
                <Header user={session?.user}></Header>
                <div className="mx-auto box-border w-full pt-6">{children}</div>
              </div>
            </ThemeProvider>
          </LazyMotionProvider>
        </UserSettingsProvider>
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
