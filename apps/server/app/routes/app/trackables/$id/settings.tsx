import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { trackable } from "@tyl/db/schema";
import { ITrackableSettings } from "@tyl/validators/trackable";

import { Button } from "~/@shad/button";
import { Spinner } from "~/@shad/spinner";
import DeleteButton from "~/components/DeleteButton";
import TrackableProvider, {
  useTrackableContextSafe,
} from "~/components/Providers/TrackableProvider";
import TrackableSettings from "~/components/TrackableSettings";

export const Route = createFileRoute("/app/trackables/$id/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    settingsMutation,
    trackable,
    settings,
    trackableQuery,
    settingsQuery,
  } = useTrackableContextSafe();

  const router = useRouter();

  if (
    !trackable ||
    !settings ||
    trackableQuery.isPending ||
    settingsQuery.isPending
  ) {
    return <Spinner />;
  }
  return (
    <TrackableSettings
      isLoadingButton={settingsMutation.isPending}
      trackableType={trackable.type}
      trackableSettings={settings}
      handleSave={async (v: ITrackableSettings) => {
        await settingsMutation.mutateAsync(v, {
          onSuccess: () => {
            router.navigate({
              to: `/app/trackables/${trackable.id}`,
            });
          },
        });
      }}
    />
  );
}
