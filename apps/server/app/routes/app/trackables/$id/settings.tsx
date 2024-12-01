import { createFileRoute, useRouter } from "@tanstack/react-router";

import type { ITrackableSettings } from "@tyl/validators/trackable";

import { Spinner } from "~/@shad/components/spinner";
import TrackableSettings from "~/components/TrackableSettings";
import {
  useTrackableIdSafe,
  useTrackableMeta,
  useTrackableSettings,
  useTrackableSettingsMutation,
} from "~/query/trackable";

export const Route = createFileRoute("/app/trackables/$id/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useTrackableIdSafe();
  const { data: trackable } = useTrackableMeta({
    id,
  });
  const { data: settings } = useTrackableSettings({ id });
  const { settingsMutation } = useTrackableSettingsMutation({ id });

  const router = useRouter();

  if (!trackable || !settings) {
    return <Spinner />;
  }
  return (
    <>
      <TrackableSettings
        trackableType={trackable.type}
        initialSettings={settings}
        handleSave={async (v: ITrackableSettings) => {
          await settingsMutation.mutateAsync(v, {
            onSuccess: () => {
              void router.navigate({
                to: `/app/trackables/${trackable.id}`,
              });
            },
          });
        }}
      />
    </>
  );
}
