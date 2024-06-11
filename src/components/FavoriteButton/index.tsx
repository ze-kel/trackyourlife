"use client";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { useUserSettings } from "@components/Providers/UserSettingsProvider";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

export const FavoriteButton = ({
  variant = "ghost",
}: {
  variant?: ButtonProps["variant"];
}) => {
  const { trackable } = useTrackableContextSafe();
  const { settings, updateSettingsPartial } = useUserSettings();

  const settingsSet = useMemo(() => {
    return new Set(settings.favorites);
  }, [settings]);

  const inFavs = trackable ? settingsSet.has(trackable.id) : false;

  const favHandler = async () => {
    if (!trackable) return;
    if (inFavs) {
      settingsSet.delete(trackable.id);
    } else {
      settingsSet.add(trackable.id);
    }
    await updateSettingsPartial({
      favorites: Array.from(settingsSet),
    });
  };

  return (
    <Button variant={variant} size={"icon"} onClick={() => void favHandler()}>
      {inFavs ? <HeartFilledIcon /> : <HeartIcon />}
    </Button>
  );
};
