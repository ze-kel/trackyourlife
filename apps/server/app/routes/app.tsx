import { Zero } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { cn } from "@shad/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { SidebarProvider } from "~/@shad/components/sidebar";
import Header from "~/components/Header";
import { AppSidebar } from "~/components/Sidebar";
import { ensureUser } from "~/query/user";
import { ensureUserSettings } from "~/query/userSettings";
import { schema } from "~/schema";

const getSidebarState = async () => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (import.meta.env.SSR) {
    const { getCookie } = await import("vinxi/http");
    const cookie = getCookie("sidebar:state");
    return cookie === "true";
  }
  return true;
};

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },

  loader: async ({ context }) => {
    const promises = await Promise.all([
      ensureUser(context.queryClient),
      ensureUserSettings(context.queryClient),
      getSidebarState(),
    ]);

    return {
      sidebarState: promises[2],
    };
  },

  component: AppComponent,
});

function AppComponent() {
  const loaderData = Route.useLoaderData();

  const z = new Zero({
    userID: "tyl-zero",
    server: "http://localhost:4848/",
    schema,
    kvStore: "mem",
  });

  return (
    <ZeroProvider zero={z}>
      <SidebarProvider defaultOpen={loaderData.sidebarState}>
        <AppSidebar />
        <div className={cn("h-full max-h-full min-h-screen w-full", "")}>
          <Header />
          <div className="mx-auto box-border w-full pt-4 max-xl:col-span-2">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </ZeroProvider>
  );
}
