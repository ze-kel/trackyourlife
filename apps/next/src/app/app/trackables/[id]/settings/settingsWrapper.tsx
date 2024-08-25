"use client";

import { useRouter } from "next/navigation";

import type { ITrackable, ITrackableSettings } from "@tyl/validators/trackable";
import { Spinner } from "@tyl/ui/spinner";

import TrackableProvider, {
  useTrackableContextSafe,
} from "~/components/Providers/TrackableProvider";
import TrackableSettings from "~/components/TrackableSettings";

const SettingWrapperContext = ({ id }: { id: ITrackable["id"] }) => {
  return (
    <TrackableProvider id={id}>
      <SettingsWrapper></SettingsWrapper>
    </TrackableProvider>
  );
};

const SettingsWrapper = () => {
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
            router.push(`/app/trackables/${trackable.id}`);
          },
        });
      }}
    />
  );
};

export default SettingWrapperContext;
