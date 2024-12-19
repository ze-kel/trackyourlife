import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import type { ITrackable, ITrackableUpdate } from "@tyl/validators/trackable";
import { ZTrackableWithData } from "@tyl/validators/trackable";

import { Button } from "~/@shad/components/button";
import { Input } from "~/@shad/components/input";
import { invalidateTrackablesList } from "~/query/trackablesList";
import { trpc } from "~/trpc/react";

const getBackup = async () => {
  const res = await trpc.trackablesRouter.getAllTrackables.query({
    limits: {
      type: "range",
      from: {
        year: 1990,
        month: 0,
      },
      to: {
        year: new Date().getFullYear() + 1,
        month: 0,
      },
    },
  });
  const a = document.createElement("a");
  const blob = new Blob([JSON.stringify(res, null, 4)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", `TYL_BACKUP_${new Date().getTime()}`);
  a.click();
};

export const BackupAndRestore = () => {
  const [fileData, setFileData] = useState(["", ""]);

  return (
    <div>
      <h2 className="mt-4 text-xl">Backup and Restore Trackables</h2>

      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center">
        <Button variant={"outline"} onClick={() => getBackup()}>
          Backup to .json
        </Button>

        <Button asChild variant={"outline"} className="cursor-pointer">
          <label htmlFor="backupJsonLoad">Load backup file</label>
        </Button>

        <div className="text-sm opacity-50">{fileData[0]}</div>

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
                setFileData([name, reader.result]);
              }
            };
          }}
        />
      </div>

      <p className="mt-2 text-xs opacity-50">
        User settings and favorites are not backed up
      </p>

      {fileData[1] && (
        <div className="mt-4">
          <FileParser content={fileData[1]} />
        </div>
      )}
    </div>
  );
};

const backupZ = z.array(ZTrackableWithData);

const parseContentJson = (content: string) => {
  try {
    return { result: JSON.parse(content) as unknown };
  } catch (e) {
    return { error: "Error when parsing JSON: " + String(e) };
  }
};

const FileParser = ({ content }: { content?: string }) => {
  const [prefix, setPrefix] = useState("");

  if (!content?.length) return;

  const objectFromJson = parseContentJson(content);

  if (objectFromJson.error) {
    return <div className="font-mono text-sm">{objectFromJson.error}</div>;
  }

  let rr = objectFromJson.result;

  if (Array.isArray(objectFromJson.result)) {
    rr = objectFromJson.result.map((v) => {
      v.updated = new Date(v.updated);
      return v;
    });
  }

  const parsed = backupZ.safeParse(rr);

  if (!parsed.success) {
    console.log(parsed.error);
    return (
      <div className="font-mono text-sm">
        Error{parsed.error.errors.length > 1 ? "s" : ""} when checking against
        backup schema:{" "}
        {parsed.error.errors.map((v, i) => (
          <div key={i}>{v.message}</div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-xs">
        Prefix for item names:
        <Input
          className="mt-2"
          onChange={(e) => setPrefix(e.target.value)}
          value={prefix}
          placeholder="restored_"
        />
      </div>

      <div className="grid auto-cols-auto grid-cols-6 items-center justify-center gap-2 py-3 text-xs md:grid-cols-7">
        <div className="col-span-2 truncate text-base md:col-span-3">Id</div>
        <div className="col-span-2 text-xs">Name</div>
        <div className="text-xs">Type</div>
        <div className=""></div>

        {parsed.data.map((v) => {
          return <ParsedItem namePrefix={prefix} trackable={v} key={v.id} />;
        })}
      </div>
    </>
  );
};

const ParsedItem = ({
  trackable,
  namePrefix,
}: {
  namePrefix: string;
  trackable: ITrackable;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [savedId, setSavedId] = useState("");

  const qc = useQueryClient();

  const save = async () => {
    setIsLoading(true);
    const newOne = await trpc.trackablesRouter.createTrackable.mutate({
      name: `${namePrefix}${trackable.name}`,
      settings: trackable.settings,
      type: trackable.type,
    });

    console.log(newOne);

    const allEntries: ITrackableUpdate[] = [];

    Object.entries(trackable.data).forEach(([year, yearData]) => {
      Object.entries(yearData).forEach(([month, monthData]) => {
        Object.entries(monthData).forEach(([day, value]) => {
          allEntries.push({
            id: newOne.id,
            value,
            year: Number(year),
            month: Number(month),
            day: Number(day),
          });
        });
      });
    });

    if (allEntries.length) {
      await trpc.trackablesRouter.updateTrackableEntries.mutate({
        data: allEntries,
      });
    }

    setIsLoading(false);
    setSavedId(newOne.id);
    invalidateTrackablesList(qc);
  };

  return (
    <>
      <div className="col-span-2 md:col-span-3">{trackable.id}</div>
      <div className="col-span-2">
        <span className="opacity-50">{namePrefix}</span>
        {trackable.name}
      </div>
      <div>{trackable.type}</div>

      {!savedId ? (
        <Button variant={"ghost"} isLoading={isLoading} onClick={() => save()}>
          Save
        </Button>
      ) : (
        <Button asChild variant={"outline"}>
          <a href={"/app/trackables/" + savedId} target="_blank">
            Open
          </a>
        </Button>
      )}
    </>
  );
};
