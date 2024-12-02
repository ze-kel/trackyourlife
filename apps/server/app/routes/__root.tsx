import type { QueryClient } from "@tanstack/react-query";
import * as React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { ThemeProvider } from "next-themes";

import { getUserFn } from "~/auth/authOperations";
import { LazyMotionProvider } from "~/components/Providers/lazyFramerMotionProvider";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo.js";

const iconPrefix = (path: string) =>
  process.env.SITE === "stage" ? `/stg${path}` : path;

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [
      { rel: "stylesheet", href: appCss },

      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: iconPrefix("/apple-touch-icon.png"),
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: iconPrefix("/favicon-32x32.png"),
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: iconPrefix("/favicon-16x16.png"),
      },
      {
        rel: "icon",
        href: iconPrefix("/favicon.ico"),
      },
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
        title: "TrackYourLife",
        description: `TrackYourLife is an app to track habits, mood, weight or whatever you want `,
      }),
    ],
  }),

  beforeLoad: async () => {
    const user = await getUserFn();
    return { user };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning={true}>
      <head>
        <Meta />
      </head>
      <body className="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
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
