import * as React from "react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import type {
  ITrackableSettings,
  ITrackableToCreate,
} from "@tyl/validators/trackable";
import { cloneDeep } from "@tyl/helpers";

import { Input } from "~/@shad/components/input";
import { RadioTabItem, RadioTabs } from "~/@shad/components/radio-tabs";
import TrackableSettings from "~/components/TrackableSettings";
import {
  ensureTrackablesList,
  invalidateTrackablesList,
} from "~/query/trackablesList";
import { trpc } from "~/trpc/react";

export const Route = createFileRoute("/app/create")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await ensureTrackablesList(context.queryClient);
  },
});

function RouteComponent() {
  const router = useRouter();

  const qc = useQueryClient();

  const [newOne, setNewOne] = useState<ITrackableToCreate>({
    type: "boolean",
    name: "",
    settings: {},
  });

  const nameRef = useRef("");

  const setType = (type: ITrackableToCreate["type"]) => {
    // This assumes that all settings fields are optional
    const update = cloneDeep(newOne);
    update.type = type;
    setNewOne(update);
  };

  const mutation = useMutation({
    mutationFn: trpc.trackablesRouter.createTrackable.mutate,
    onSuccess: async (data) => {
      await invalidateTrackablesList(qc);
      void router.navigate({
        to: `/app/trackables/${data.id}`,
      });
    },
  });

  const createTrackable = async (settings: ITrackableSettings) => {
    await mutation.mutateAsync({
      ...newOne,
      name: nameRef.current || "",
      settings,
    });
  };

  return (
    <div className="content-container flex flex-col gap-2 pb-6">
      <h3 className="w-full bg-inherit text-2xl font-semibold lg:text-3xl">
        Create new Trackable
      </h3>

      <Input
        placeholder="Unnamed Trackable"
        className="mt-2"
        onChange={(e) => (nameRef.current = e.target.value)}
      />

      <RadioTabs
        value={newOne.type}
        onValueChange={(v) => setType(v as ITrackableToCreate["type"])}
        className="mt-2"
      >
        <RadioTabItem value="boolean" id="boolean" className="w-full">
          Boolean
        </RadioTabItem>
        <RadioTabItem value="number" id="number" className="w-full">
          Number
        </RadioTabItem>
        <RadioTabItem value="range" id="range" className="w-full">
          Range
        </RadioTabItem>
      </RadioTabs>
      <TrackableSettings
        trackableType={newOne.type}
        initialSettings={newOne.settings}
        handleSave={createTrackable}
        customSaveButtonText="Create Trackable"
      />
    </div>
  );
}
