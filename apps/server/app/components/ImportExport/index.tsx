import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, m } from "framer-motion";
import { CheckIcon, FileTextIcon, FileUpIcon } from "lucide-react";

import type {
  TActionOnConflict,
  TImport,
  TUpdateTrackableEntries,
} from "@tyl/validators/import";
import { ActionsOnConflict, parseImport } from "@tyl/validators/import";

import { Button } from "~/@shad/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@shad/components/select";
import { Spinner } from "~/@shad/components/spinner";

const Import = () => {
  return <div>TODO</div>;
  const { id } = useTrackableIdSafe();

  const mutation = useMutation({
    mutationFn: async (input: TUpdateTrackableEntries) =>
      await trpc.trackablesRouter.importTrackableEntries.mutate(input),
  });

  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [data, setData] = useState<TImport | undefined>(undefined);

  const [actionOnConflict, setActionOnConflict] =
    useState<TActionOnConflict>("skip");

  const parseAndSet = async (content: string) => {
    setError(undefined);
    setData(undefined);

    setIsProcessing(true);
    const { error, data } = await parseImport(content);
    if (error) {
      setError(error);
    } else {
      setData(data);
    }
    setIsProcessing(false);
  };

  return (
    <div>
      <Button asChild variant={"outline"} className="cursor-pointer">
        <label htmlFor="backupJsonLoad" className="flex items-center gap-2">
          <FileUpIcon size={16} /> Load JSON file
        </label>
      </Button>

      {fileName && (
        <m.div className="mt-2 max-w-md rounded-md border border-neutral-800 p-4">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex items-center gap-2 font-mono">
              <FileTextIcon size={16} className="-translate-y-[1px]" />{" "}
              {fileName}
            </div>
            {data && (
              <div className="mt-2">
                Entries: {Object.keys(data.data).length}
              </div>
            )}
          </div>

          {isProcessing && <Spinner />}

          {error && <div className="text-red-500">{error}</div>}

          {data && (
            <>
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Select
                    value={actionOnConflict}
                    onValueChange={(value) =>
                      setActionOnConflict(value as TActionOnConflict)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ActionsOnConflict.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          On conflict: {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-64"
                    isLoading={mutation.isPending}
                    disabled={mutation.isPending}
                    onClick={() => {
                      mutation.mutate({
                        id,
                        actionOnConflict,
                        data,
                      });
                    }}
                  >
                    Import {mutation.isSuccess ? "again" : ""}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {mutation.error && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 text-red-500"
                  >
                    {mutation.error.message}
                  </m.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {mutation.isSuccess && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <CheckIcon size={16} />
                    Success! All entries were imported.
                  </m.div>
                )}
              </AnimatePresence>
            </>
          )}
        </m.div>
      )}

      <input
        className="hidden"
        type="file"
        id="backupJsonLoad"
        onChange={(e) => {
          const firstFile = e.target.files?.[0];
          if (!firstFile) return;

          const name = firstFile.name;
          const reader = new FileReader();

          reader.readAsText(firstFile);

          reader.onload = () => {
            if (typeof reader.result === "string") {
              setFileName(name);
              mutation.reset();
              void parseAndSet(reader.result);
            }
          };
        }}
      />
    </div>
  );
};

export { Import };
