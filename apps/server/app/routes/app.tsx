import { Zero } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { cn } from "@shad/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { SidebarProvider } from "~/@shad/components/sidebar";
import Header from "~/components/Header";
import { UserProvider } from "~/components/Providers/UserContext";
import { AppSidebar } from "~/components/Sidebar";
import { schema } from "~/schema";

export const Route = createFileRoute("/app")({
  component: AppComponent,
});

function AppComponent() {
  const z = new Zero({
    userID: "tyl-zero",
    server: "http://localhost:4848/",
    schema,
    kvStore: "idb",
  });

  return (
    <ZeroProvider zero={z}>
      <UserProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className={cn("h-full max-h-full min-h-screen w-full", "")}>
            <Header />
            <div className="mx-auto box-border w-full pt-4 max-xl:col-span-2">
              <Outlet />
            </div>
          </div>
        </SidebarProvider>
      </UserProvider>
    </ZeroProvider>
  );
}
