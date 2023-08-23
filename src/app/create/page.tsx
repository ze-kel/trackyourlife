"use client";
import { Button } from "@/components/ui/button";
import type {
  ITrackableSettings,
  ITrackableUnsaved,
} from "src/types/trackable";
import clsx from "clsx";
import { useState } from "react";
import { PureInput } from "@components/_UI/Input";
import cloneDeep from "lodash/cloneDeep";
import { TrackableSettingsManual } from "@components/TrackableSettings";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { useRouter } from "next/navigation";
import { RadioTabItem, RadioTabs } from "@/components/ui/radio-tabs";

const Create = () => {
  const [newOne, setNewOne] = useState<ITrackableUnsaved>({
    type: "boolean",
    data: {},
    settings: { name: "" },
  });
  const router = useRouter();

  const create = async () => {
    const res = await fetch(`${getBaseUrl()}/api/trackables`, {
      method: "PUT",
      body: JSON.stringify(newOne),
      credentials: "include",
    });

    if (res.redirected) {
      router.push(res.url);
    }
  };

  const updateName = (name: string) => {
    const update = cloneDeep(newOne);
    update.settings.name = name;
    setNewOne(update);
  };

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

  return (
    <>
      <div className="content-container flex flex-col gap-2">
        <h3 className="w-full bg-inherit text-2xl font-semibold">
          Create new Trackable
        </h3>
        <RadioTabs
          value={newOne.type}
          onValueChange={(v) => setType(v as ITrackableUnsaved["type"])}
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
        <div>
          <h3 className="text-xl">Name</h3>
          <PureInput
            placeholder="Name"
            className={clsx("my-2 w-fit")}
            value={newOne.settings.name}
            onChange={(e) => updateName(e.target.value)}
          />
        </div>
        <TrackableSettingsManual trackable={newOne} setSettings={setSettings} />

        <Button
          onClick={() => void create()}
          className="mt-5 w-full"
          variant={"outline"}
        >
          Create
        </Button>
      </div>
    </>
  );
};

export default Create;
