import { useState } from "react";
import { StickyNoteIcon } from "lucide-react";

import { Button } from "~/@shad/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@shad/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/@shad/components/drawer";
import { Textarea } from "~/@shad/components/textarea";
import { useTrackableMeta } from "~/components/Providers/TrackableProvider";
import { useIsDesktop } from "~/utils/useIsDesktop";
import { useZ, useZeroTrackable } from "~/utils/useZ";

export const TrackableNoteEditable = () => {
  const { id } = useTrackableMeta();
  const [trackable] = useZeroTrackable({ id });
  const z = useZ();

  const hasNote = Boolean(trackable?.attached_note);

  const [isEditing, setIsEditing] = useState(false);

  const [internalValue, setInternalValue] = useState("");

  const isDesktop = useIsDesktop();

  const saveHandler = () => {
    void z.mutate.TYL_trackable.update({
      id,
      attached_note: internalValue,
    });
    setIsEditing(false);
  };

  const display = hasNote ? (
    <p className="cursor-pointer whitespace-pre-wrap rounded-md bg-inherit px-2 py-1 text-left text-sm dark:text-neutral-300 md:text-base">
      {trackable?.attached_note}
    </p>
  ) : (
    <Button variant="outline" className="w-fit gap-2">
      <StickyNoteIcon />
      <span className="max-lg:hidden">Add note</span>{" "}
    </Button>
  );

  const openChangeHandler = (v: boolean) => {
    if (v === true) {
      setInternalValue(trackable?.attached_note ?? "");
    }
    setIsEditing(v);
  };

  const title = <>{hasNote ? "Edit" : "Create"} attached note</>;

  return isDesktop ? (
    <Dialog open={isEditing} onOpenChange={openChangeHandler}>
      <DialogTrigger asChild>{display}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Textarea
          autoFocus
          className="min-h-64 w-full"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveHandler();
            }
          }}
        />
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={isEditing}
      onClose={() => setIsEditing(false)}
      onOpenChange={openChangeHandler}
    >
      <DrawerTrigger asChild>{display}</DrawerTrigger>
      <DrawerContent className="py-4">
        <DrawerTitle>{title}</DrawerTitle>

        <div className="p-6">
          <Textarea
            autoFocus
            className="min-h-48 w-full text-left"
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            onBlur={saveHandler}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
