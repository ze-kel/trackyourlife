import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Poppins } from "next/font/google";
import { init } from "emoji-mart";
import data from "@emoji-mart/data";
import { useEffect } from "react";
import UserSettingsProvider from "src/helpers/userSettingsContext";
import type { IUserSettings } from "@t/user";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const userSettings = api.user.getUserSettings.useQuery();

  useEffect(() => {
    void init({ data });
  }, []);

  const getDarkModeStatus = (v: IUserSettings["theme"]) => {
    if (v === "dark") return "dark";
    if (v === "light") return "";
    if (typeof window !== "undefined" && v === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
    }
    return "";
  };

  return (
    <SessionProvider session={session}>
      <UserSettingsProvider settings={userSettings.data || {}}>
        <style jsx global>{`
          html {
            font-family: ${font.style.fontFamily};
          }
        `}</style>
        <div className={getDarkModeStatus(userSettings.data?.theme)}>
          <div className="h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
            <Component {...pageProps} />
          </div>
        </div>
        <ReactQueryDevtools />
      </UserSettingsProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
