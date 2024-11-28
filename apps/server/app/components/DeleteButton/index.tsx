import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { cn } from "~/@shad";
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
} from "~/@shad/alert-dialog";
import { buttonVariants } from "~/@shad/button";
import { trpc } from "~/trpc/react";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: trpc.trackablesRouter.deleteTrackable.mutate,
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["trackables", "list"],
      });
      await router.navigate({ to: "/app/trackables" });
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
