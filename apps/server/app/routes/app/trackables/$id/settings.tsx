import { createFileRoute, useRouter } from "@tanstack/react-router";

import { ITrackableSettings } from "@tyl/validators/trackable";

import { Spinner } from "~/@shad/spinner";
import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";
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
    <>
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
    </>
  );
}
