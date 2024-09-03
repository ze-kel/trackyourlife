"use client";

import { useRouter } from "next/navigation";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@tyl/ui";
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

import { api } from "~/trpc/react";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.trackablesRouter.deleteTrackable.mutate,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["trackables", "list"],
      });
      router.push("/app/trackables/");
    },
  });

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
            onClick={() => void mutation.mutateAsync({ id })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
