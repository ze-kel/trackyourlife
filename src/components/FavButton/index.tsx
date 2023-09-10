"use client";
import { Button } from "@/components/ui/button";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import type { ITrackable } from "@t/trackable";
import { useState, useEffect } from "react";
import { updateSettings } from "src/helpers/actions";

function useOptimistic<T>(passthrough: T) {
  const [value, setValue] = useState<T>(passthrough);

  useEffect(() => {
    setValue(passthrough);
  }, [passthrough]);

  return [value, setValue] as const;
}

const FavButton = ({ trackable }: { trackable: ITrackable }) => {
  const [val, setVal] = useOptimistic(trackable.settings.favorite);

  const switchFav = async () => {
    setVal(!trackable.settings.favorite);
    await updateSettings({
      id: trackable.id,
      settings: {
        ...trackable.settings,
        favorite: !trackable.settings.favorite,
      },
    });
  };

  return (
    <>
      <Button variant={"ghost"} size={"icon"} onClick={() => void switchFav()}>
        {val ? <HeartFilledIcon /> : <HeartIcon />}
      </Button>
    </>
  );
};

export default FavButton;
