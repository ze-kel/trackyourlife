"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@tyl/ui/button";
import {
  ITrackable,
  ITrackableUpdate,
  ZTrackable,
} from "@tyl/validators/trackable";

import { api } from "~/trpc/react";

const getBackup = async () => {
  const res = await api.trackablesRouter.getAllTrackables.query({
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
  const a = document.createElement("a"); // Create "a" element
  const blob = new Blob([JSON.stringify(res, null, 4)], {
    type: "application/json",
  }); // Create a blob (file-like object)
  const url = URL.createObjectURL(blob); // Create an object URL from blob
  a.setAttribute("href", url); // Set "a" element link
  a.setAttribute("download", `TYL_BACKUP_${new Date().getTime()}`); // Set download filename
  a.click(); // Start downloading
};

export const BackupAndRestore = () => {
  const [fileData, setFileData] = useState(["", ""]);

  return (
    <div>
      <h2 className="mt-4 text-xl">Backup and Restore Trackables</h2>
      <p className="text-xs">User settings and favorites are not backed up</p>

      <div className="mt-2 flex flex-col gap-4 md:items-center">
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
            console.log("ff", firstFile);
            if (!firstFile) return;

            const name = firstFile.name;
            let reader = new FileReader();

            reader.readAsText(firstFile);

            reader.onload = () => {
              if (typeof reader.result === "string") {
                setFileData([name, reader.result as string]);
              }
            };
          }}
        />
      </div>

      {fileData[1] && (
        <div className="mt-4">
          <FileParser content={fileData[1]} />
        </div>
      )}
    </div>
  );
};

const backupZ = z.array(ZTrackable);

const parseContentJson = (content: string) => {
  try {
    return { result: JSON.parse(content) };
  } catch (e) {
    return { error: "Error when parsing JSON: " + e };
  }
};

const FileParser = ({ content }: { content?: string }) => {
  if (!content || !content.length) return;

  const objectFromJson = parseContentJson(content);

  if (objectFromJson.error) {
    return <div className="font-mono text-sm">{objectFromJson.error}</div>;
  }

  const parsed = backupZ.safeParse(objectFromJson.result);

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
    <div className="grid auto-cols-auto grid-cols-6 items-center justify-center gap-2 py-3 text-xs md:grid-cols-7">
      <div className="col-span-2 truncate md:col-span-3">Id</div>
      <div className="col-span-2">Name</div>
      <div className="">Type</div>
      <div className=""></div>

      {parsed.data.map((v) => {
        return <ParsedItem trackable={v} key={v.id} />;
      })}
    </div>
  );
};

const ParsedItem = ({ trackable }: { trackable: ITrackable }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [savedId, setSavedId] = useState("");

  const save = async () => {
    setIsLoading(true);
    const newOne = await api.trackablesRouter.createTrackable.mutate({
      name: `restored_${trackable.name}`,
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

    console.log(allEntries);

    await api.trackablesRouter.updateTrackableEntries.mutate(allEntries);

    console.log("all good");
    setIsLoading(false);
    setSavedId(newOne.id);
  };

  return (
    <>
      <div className="col-span-2 md:col-span-3">{trackable.id}</div>
      <div className="col-span-2"> {trackable.name}</div>
      <div>{trackable.type}</div>

      {!savedId ? (
        <Button variant={"ghost"} isLoading={isLoading} onClick={() => save()}>
          Save
        </Button>
      ) : (
        <Button asChild>
          <a href={"/trackables/" + savedId} target="_blank">
            Open
          </a>
        </Button>
      )}
    </>
  );
};
