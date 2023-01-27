import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import { Poppins } from "@next/font/google";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <div id="modal-portal"></div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
