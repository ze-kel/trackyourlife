import { cn } from "@shad/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { SidebarProvider } from "~/@shad/components/sidebar";
import Header from "~/components/Header";
import { AppSidebar } from "~/components/Sidebar";
import { ensureUser } from "~/query/user";
import { ensureUserSettings } from "~/query/userSettings";

const getSidebarState = async () => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (import.meta.env.SSR) {
    const { getCookie } = await import("vinxi/http");
    const cookie = getCookie("sidebar:state");
    console.log("cookie", cookie);
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
    await ensureUser(context.queryClient);
    await ensureUserSettings(context.queryClient);

    return {
      sidebarState: await getSidebarState(),
    };
  },

  component: () => <AppComponent />,
});

const AppComponent = () => {
  const { sidebarState } = Route.useLoaderData();

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <div className={cn("h-full max-h-full min-h-screen w-full", "")}>
        <Header />
        <div className="mx-auto box-border w-full pt-4 max-xl:col-span-2">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};
