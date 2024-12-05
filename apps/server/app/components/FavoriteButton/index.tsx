import { useMemo } from "react";
import { m } from "framer-motion";
import { HeartIcon } from "lucide-react";

import type { ButtonProps } from "~/@shad/components/button";
import { Button } from "~/@shad/components/button";
import { useTrackableIdSafe } from "~/query/trackable";
import { useUserSettings, useUserSettingsMutation } from "~/query/userSettings";

export const FavoriteButton = ({
  variant = "ghost",
  onlyIcon = false,
}: {
  variant?: ButtonProps["variant"];
  onlyIcon?: boolean;
}) => {
  const { id } = useTrackableIdSafe();
  const settings = useUserSettings();
  const { updateSettingsPartial } = useUserSettingsMutation();

  const settingsSet = useMemo(() => {
    return new Set(settings.favorites);
  }, [settings]);

  const inFavs = id ? settingsSet.has(id) : false;

  const favHandler = async () => {
    if (!id) return;
    if (inFavs) {
      settingsSet.delete(id);
    } else {
      settingsSet.add(id);
    }
    await updateSettingsPartial({
      favorites: Array.from(settingsSet),
    });
  };

  return (
    <Button asChild variant={variant} onClick={() => void favHandler()}>
      <m.button layout transition={{ ease: "circOut" }}>
        {inFavs ? (
          <>
            <HeartIcon className="iconFill" fill="currentColor" size={16} />
            {!onlyIcon && <span className="max-md:hidden">Unfavorite</span>}
          </>
        ) : (
          <>
            <HeartIcon size={16} />
            {!onlyIcon && <span className="max-md:hidden">Favorite</span>}
          </>
        )}
      </m.button>
    </Button>
  );
};
