import {
  DehydratedState,
  Hydrate,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import { trpc } from "src/utils/trpc";
import "../styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <div id="modal-portal"></div>
      </Hydrate>
    </>
  );
}

export default trpc.withTRPC(MyApp);
