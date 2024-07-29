import * as React from "react";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRoute,
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import { Session, User } from "@tyl/auth";

import appCss from "../styles/globals.css?url";

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
  return (
    <RootDocument>
      <div className="bg-red-400">
        <Outlet />
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
