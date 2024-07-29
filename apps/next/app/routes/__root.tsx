import * as React from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import type { ServerCallerType } from "@tyl/api";
import { Session, User } from "@tyl/auth";
import { cn } from "@tyl/ui";

import Header from "~/components/Header";
import { Sidebar } from "~/components/Sidebar";
import { api } from "~/trpc/react";
import appCss from "../styles/globals.css?url";
import m from "./root.module.css";

type RouterContext = {
  queryClient: QueryClient;
  user?: User | null;
  session?: Session | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "TanStack Start Starter",
    },
  ],
  links: () => [{ rel: "stylesheet", href: appCss }],
  component: RootComponent,
});

function RootComponent() {
  const u = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return api.userRouter.getMe.query();
    },
    staleTime: Infinity,
  });

  return (
    <RootDocument>
      {" "}
      <div
        className={cn(
          "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
          m.wrapperGrid,
        )}
      >
        <div className="bg sticky top-0 z-[999] col-span-2 flex h-14 justify-center border-b-2 border-neutral-300 bg-neutral-100 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <Header user={u.data} />
        </div>
        <div className="sidebar sticky top-14 hidden h-full max-h-[calc(100vh-3.5rem)] overflow-scroll border-r-2 border-neutral-300 bg-neutral-100 px-3 py-6 dark:border-neutral-800 dark:bg-neutral-900 xl:block">
          {u.data && <Sidebar />}
        </div>
        <div className="mx-auto box-border w-full pt-6 max-xl:col-span-2">
          <Outlet />
        </div>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
