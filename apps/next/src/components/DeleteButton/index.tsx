"use client";
import { TrashIcon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@tyl/ui/alert-dialog";
import { buttonVariants } from "@tyl/ui/button";
import { RSADeleteTrackable } from "src/app/api/trackables/serverActions";
import { cn } from "@tyl/ui"

const DeleteButton = ({ id }: { id: string }) => {
  const performDelete = async () => {
    await RSADeleteTrackable(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        name="delete"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "shrink-0",
        )}
      >
        <TrashIcon className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            trackale.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            name="confirm delete"
            onClick={() => void performDelete()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
