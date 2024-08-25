"use client";

import { useMemo } from "react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";

import type { ButtonProps } from "@tyl/ui/button";
import { Button } from "@tyl/ui/button";

import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";
import { userUserContext } from "~/components/Providers/UserProvider";

export const FavoriteButton = ({
  variant = "ghost",
}: {
  variant?: ButtonProps["variant"];
}) => {
  const { trackable } = useTrackableContextSafe();
  const { settings, updateSettingsPartial } = userUserContext();

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
