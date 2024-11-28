import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { BackupAndRestore } from "~/components/Settings/backup";
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
      <h1 className="mb-2 text-2xl font-semibold lg:text-4xl">User settings</h1>

      <div>
        <div className="flex gap-2">
          <h2 className="text-xl">Timezone</h2>
          <CurrentTime />
        </div>

        <TimezoneSelector list={tz} />

        <p className="mt-2 text-xs opacity-50">
          Used to accurately determine time when rendering on the server. Has no
          effect on mobile app.{" "}
        </p>
      </div>

      <BackupAndRestore />
    </div>
  );
}
