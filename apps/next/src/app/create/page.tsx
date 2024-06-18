"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import cloneDeep from "lodash/cloneDeep";

import type {
  ITrackableSettings,
  ITrackableUnsaved,
} from "@tyl/validators/trackable";
import { Input } from "@tyl/ui/input";
import { RadioTabItem, RadioTabs } from "@tyl/ui/radio-tabs";

import TrackableSettings from "~/components/TrackableSettings";
import { api } from "~/trpc/react";

const Create = () => {
  const router = useRouter();

  const [newOne, setNewOne] = useState<ITrackableUnsaved>({
    type: "boolean",
    data: {},
    name: "",
    settings: {},
  });

  const nameRef = useRef("");

  const setType = (type: ITrackableUnsaved["type"]) => {
    // This assumes that all settings fields are optional
    const update = cloneDeep(newOne);
    update.type = type;
    setNewOne(update);
  };

  const mutation = useMutation({
    mutationFn: api.trackablesRouter.createTrackable.mutate,
    onSuccess: (data) => {
      router.push(`/trackables/${data.id}`);
    },
  });

  const createTrackable = async (settings: ITrackableSettings) => {
    await mutation.mutate({
      ...newOne,
      name: nameRef.current || "",
      settings,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="content-container flex flex-col gap-2">
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
        onValueChange={(v) => setType(v as ITrackableUnsaved["type"])}
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
        isLoadingButton={mutation.isPending}
        trackableType={newOne.type}
        trackableSettings={newOne.settings}
        handleSave={createTrackable}
        customSaveButtonText="Create Trackable"
      />
    </div>
  );
};

export default Create;
