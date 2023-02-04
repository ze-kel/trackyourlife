import Button from "@components/_UI/Button";
import type { ISelectorOption } from "@components/_UI/Selector";
import Selector from "@components/_UI/Selector";
import type {
  ITrackableSettings,
  ITrackableUnsaved,
} from "src/types/trackable";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "src/utils/api";
import Page from "@components/Page";
import { PureInput } from "@components/_UI/Input";
import { cloneDeep } from "lodash";
import { TrackableSettingsManual } from "@components/TrackableSettings";

const types: ISelectorOption<ITrackableUnsaved["type"]>[] = [
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Range", value: "range" },
];

const Create = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [newOne, setNewOne] = useState<ITrackableUnsaved>({
    type: "boolean",
    data: {},
    settings: { name: "" },
  });

  const router = useRouter();

  const mutation = api.trackable.createTrackable.useMutation();

  const create = async () => {
    const saved = await mutation.mutateAsync(newOne);

    await router.push(`/trackable/${saved.id}`);
    if (onSuccess) {
      onSuccess();
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
    <Page>
      <div className="flex flex-col gap-2">
        <h3 className="w-full bg-inherit text-2xl font-semibold">
          Create new Trackable
        </h3>
        <Selector
          active={newOne.type}
          options={types}
          setter={setType}
        ></Selector>

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
          className="mt-5 w-56"
          theme="outline"
        >
          Create
        </Button>
      </div>
    </Page>
  );
};

export default Create;
