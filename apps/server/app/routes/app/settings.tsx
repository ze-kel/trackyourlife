import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { BackupAndRestore } from "~/components/Settings/backup";
import { ThemeSwitcher } from "~/components/Settings/themeSwitcher";
import {
  CurrentTime,
  TimezoneSelector,
} from "~/components/Settings/timezoneSelector";
import { getTimezones } from "~/components/Settings/timzones";

export const Route = createFileRoute("/app/settings")({
  component: RouteComponent,
  loader: async () => {
    return await getTimezones();
  },
});

function RouteComponent() {
  const tz = Route.useLoaderData();

  return (
    <div className="content-container">
      <h3 className="w-full bg-inherit text-2xl font-semibold lg:text-3xl">
        Settings
      </h3>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div>Theme</div>
          <ThemeSwitcher />
        </div>

        <div>
          <div className="flex gap-2">
            <h2 className="text-xl">Timezone</h2>
            <CurrentTime />
          </div>

          <TimezoneSelector list={tz} />

          <p className="mt-2 text-xs opacity-50">
            Used to accurately determine time when rendering on the server. Has
            no effect on mobile app.{" "}
          </p>
        </div>

        <BackupAndRestore />
      </div>
    </div>
  );
}
