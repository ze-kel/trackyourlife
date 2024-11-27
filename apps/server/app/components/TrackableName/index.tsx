import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "~/@shad/button";
import { Drawer, DrawerContent } from "~/@shad/drawer";
import { Input } from "~/@shad/input";
import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";

export const TrackableNameEditable = () => {
  const { trackable, updateName } = useTrackableContextSafe();

  const [isEditing, setIsEditing] = useState(false);

  const [internalValue, setInternalValue] = useState("");

  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });

  const saveHandler = () => {
    void updateName(internalValue || "");
    setIsEditing(false);
  };

  if (isEditing)
    return isDesktop ? (
      <div className="flex gap-2">
        <Input
          autoFocus
          className="w-64"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveHandler();
            }
          }}
        />
        <Button variant={"outline"} onClick={saveHandler}>
          Save
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    ) : (
      <>
        <h2
          className="w-fit w-full bg-inherit text-xl font-semibold md:text-2xl"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {trackable?.name || `Unnamed ${trackable?.type || ""}`}
        </h2>
        <Drawer open={isEditing} onClose={() => setIsEditing(false)}>
          <DrawerContent className="py-4">
            <Input
              autoFocus
              className="w-64"
              value={internalValue}
              onChange={(e) => setInternalValue(e.target.value)}
              onBlur={saveHandler}
            />
          </DrawerContent>
        </Drawer>
      </>
    );

  return (
    <h2
      className="w-fit w-full bg-inherit text-xl font-semibold md:text-2xl"
      onClick={() => {
        setIsEditing(true);
        setInternalValue(trackable?.name || "");
      }}
    >
      {trackable?.name || `Unnamed ${trackable?.type || ""}`}
    </h2>
  );
};

export const TrackableNameText = () => {
  const { trackable } = useTrackableContextSafe();

  return <> {trackable?.name || `Unnamed ${trackable?.type || ""}`}</>;
};
