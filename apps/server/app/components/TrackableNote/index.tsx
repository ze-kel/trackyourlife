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
import {
  useTrackableIdSafe,
  useTrackableMeta,
  useTrackableNoteMutation,
} from "~/query/trackable";
import { useIsDesktop } from "~/utils/useIsDesktop";

export const TrackableNoteEditable = () => {
  const { id } = useTrackableIdSafe();
  const { data: trackable } = useTrackableMeta({ id });

  const hasNote = Boolean(trackable?.note);

  const noteMutation = useTrackableNoteMutation(trackable?.id ?? "");

  const [isEditing, setIsEditing] = useState(false);

  const [internalValue, setInternalValue] = useState("");

  const isDesktop = useIsDesktop();

  const saveHandler = () => {
    void noteMutation.mutate(internalValue);
    setIsEditing(false);
  };

  const display = hasNote ? (
    <p className="cursor-pointer whitespace-pre-wrap rounded-md bg-inherit px-2 py-1 text-left text-sm dark:text-neutral-300 md:text-base">
      {trackable?.note}
    </p>
  ) : (
    <Button variant="outline" className="w-fit gap-2">
      <StickyNoteIcon />
      <span className="max-lg:hidden">Add note</span>{" "}
    </Button>
  );

  const openChangeHandler = (v: boolean) => {
    if (v === true) {
      setInternalValue(trackable?.note ?? "");
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
