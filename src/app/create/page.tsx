"use client";
import { Button } from "@/components/ui/button";
import type {
  ITrackableSettings,
  ITrackableUnsaved,
} from "src/types/trackable";
import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { TrackableSettingsManual } from "@components/TrackableSettings";
import { RadioTabItem, RadioTabs } from "@/components/ui/radio-tabs";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { useRouter } from "next/navigation";

const Create = () => {
  const router = useRouter();

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

  const setSettings = (settings: ITrackableSettings) => {
    const update = cloneDeep(newOne);
    update.settings = settings;
    setNewOne(update);
  };

  const createTrackable = async () => {
    const res = await fetch(`${getBaseUrl()}/api/trackables`, {
      method: "PUT",
      body: JSON.stringify(newOne),
    });

    if (res.redirected) {
      router.refresh();
    }
  };

  return (
    <div className="content-container flex flex-col gap-2">
      <h3 className="w-full bg-inherit text-2xl font-semibold">
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
      <TrackableSettingsManual trackable={newOne} setSettings={setSettings} />

      <Button
        onClick={() => void createTrackable()}
        className="mt-5 w-full"
        variant={"outline"}
      >
        Create
      </Button>
    </div>
  );
};

export default Create;
