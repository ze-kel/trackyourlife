"use client";
import type { ITrackable } from "@t/trackable";
import { RSAUpdateTrackableSettings } from "src/app/api/trackables/serverActions";
import type { ITrackableSettings } from "@t/trackable";
import { useState } from "react";
import TrackableSettings from "@components/TrackableSettings";

const SettingWrapper = ({ trackable }: { trackable: ITrackable }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (settings: ITrackableSettings) => {
    setIsLoading(true);
    await RSAUpdateTrackableSettings({
      trackableId: trackable.id,
      data: settings,
      redirectToTrackablePage: true,
    });
    setIsLoading(false);
  };

  return (
    <TrackableSettings
      isLoadingButton={isLoading}
      trackable={trackable}
      handleSave={handleSave}
    />
  );
};

export default SettingWrapper;
