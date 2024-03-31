"use client";
import type {
  ITrackableSettings,
  ITrackableUnsaved,
} from "src/types/trackable";
import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import TrackableSettings from "@components/TrackableSettings";
import { RadioTabItem, RadioTabs } from "@/components/ui/radio-tabs";
import { RSACreateTrackable } from "src/app/api/trackables/serverActions";

const Create = () => {
  const [newOne, setNewOne] = useState<ITrackableUnsaved>({
    type: "boolean",
    data: {},
    settings: { name: "" },
  });

  const setType = (type: ITrackableUnsaved["type"]) => {
    // This assumes that all settings fields are optional
    const update = cloneDeep(newOne);
    update.type = type;
    setNewOne(update);
  };
  const createTrackable = async (settings: ITrackableSettings) => {
    setIsLoading(true);
    await RSACreateTrackable({ ...newOne, settings });
    setIsLoading(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="content-container flex flex-col gap-2">
      <h3 className="w-full bg-inherit text-2xl font-semibold lg:text-3xl">
        Create new Trackable
      </h3>
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
        isLoadingButton={isLoading}
        trackable={newOne}
        handleSave={createTrackable}
        customSaveButtonText="Create Trackable"
      />
    </div>
  );
};

export default Create;
