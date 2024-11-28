import type { QueryClient } from "@tanstack/react-query";
import * as React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Meta, Scripts } from "@tanstack/start";
import { ThemeProvider } from "next-themes";

import { getUserFn } from "~/auth/authOperations";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js";
import { NotFound } from "~/components/NotFound.js";
import { LazyMotionProvider } from "~/components/Providers/lazyFramerMotionProvider";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo.js";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
  }),

  beforeLoad: async () => {
    const user = await getUserFn();
    return { user };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <LazyMotionProvider>
          <ThemeProvider defaultTheme="dark" attribute="class">
            {children}
            <ScrollRestoration />
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <Scripts />
          </ThemeProvider>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
