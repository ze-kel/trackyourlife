import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { validateRequest } from "@tyl/auth";
import { cn } from "@tyl/ui";
import { UserSettingsFallback } from "@tyl/validators/user";

import Header from "~/components/Header";
import { api } from "~/trpc/server";

const fetchUserSettingsIfPossible = async () => {
  try {
    const userSettings = await api.userRouter.getUserSettings();
    return userSettings;
  } catch (e) {
    return UserSettingsFallback;
  }
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, session } = await validateRequest();

  if (session) {
    redirect("/");
  }

  return (
    <div
      className={cn(
        "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
      )}
    >
      <div className="bg sticky top-0 z-[999] col-span-2 flex h-14 justify-center border-b-2 border-neutral-300 bg-neutral-100 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <Header />
      </div>

      <div className="mx-auto box-border w-full pt-6 max-xl:col-span-2">
        {children}
      </div>
    </div>
  );
}
