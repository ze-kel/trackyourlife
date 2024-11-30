import { cn } from "@shad/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";

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
} from "~/@shad/components/alert-dialog";
import { buttonVariants } from "~/@shad/components/button";
import { invalidateTrackablesList } from "~/query/trackablesList";
import { trpc } from "~/trpc/react";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: trpc.trackablesRouter.deleteTrackable.mutate,
    onSuccess: async () => {
      await invalidateTrackablesList(qc);
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
        <TrashIcon size={16} />
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
