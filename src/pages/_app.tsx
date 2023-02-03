import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Poppins } from "@next/font/google";
import { init } from "emoji-mart";
import data from "@emoji-mart/data";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    void init({ data });
  }, []);
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
