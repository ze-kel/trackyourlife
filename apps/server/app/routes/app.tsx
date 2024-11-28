import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { cn } from "~/@shad";
import Header from "~/components/Header";
import { Sidebar } from "~/components/Sidebar";
import { ensureUser } from "~/query/user";
import { ensureUserSettings } from "~/query/userSettings";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },

  loader: async ({ context }) => {
    await ensureUser(context.queryClient);
    await ensureUserSettings(context.queryClient);
  },

  component: () => {
    return (
      <div
        className={cn(
          "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
          "grid grid-cols-[256px_1fr] grid-rows-[min-content]",
        )}
      >
        <div className="bg sticky top-0 z-[999] col-span-2 flex h-14 justify-center border-b-2 border-neutral-300 bg-neutral-100 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <Header />
        </div>
        <div className="sidebar customScrollBar customScrollBarBig sticky top-14 hidden h-full max-h-[calc(100vh-3.5rem)] overflow-auto border-r-2 border-neutral-300 bg-neutral-100 px-3 py-6 dark:border-neutral-800 dark:bg-neutral-900 xl:block">
          <Sidebar />
        </div>
        <div className="mx-auto box-border w-full pt-6 max-xl:col-span-2">
          <Outlet />
        </div>
      </div>
    );
  },
});
