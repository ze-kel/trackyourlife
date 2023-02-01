import Button from "@components/_UI/Button";
import type { ISelectorOption } from "@components/_UI/Selector";
import Selector from "@components/_UI/Selector";
import type { ITrackableUnsaved } from "src/types/trackable";
import clsx from "clsx";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { api } from "src/utils/api";
import Page from "@components/Page";
import { PureInput } from "@components/_UI/Input";

const Create = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [name, setName] = useState<ITrackableUnsaved["settings"]["name"]>("");
  const [type, setType] = useState<ITrackableUnsaved["type"]>("boolean");

  const [nameValidationFail, setNameValidationFail] = useState(false);

  const types: ISelectorOption<ITrackableUnsaved["type"]>[] = [
    { label: "Boolean", value: "boolean" },
    { label: "Number", value: "number" },
    { label: "Range", value: "range" },
  ];

  const router = useRouter();

  const mutation = api.trackable.createTrackable.useMutation();

  const create = async () => {
    if (!name) {
      setNameValidationFail(true);
      return;
    }

    const newOne = {
      type: type,
      settings: {
        name,
      },
      data: {},
    };

    const saved = await mutation.mutateAsync(newOne);

    await router.push(`/trackable/${saved.id}`);
    if (onSuccess) {
      onSuccess();
    }
  };

  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setNameValidationFail(true);
    } else {
      false;
    }
    setName(e.target.value);
  };

  return (
    <Page>
      <h3 className="text-2xl font-bold">Create new Trackable</h3>
      <PureInput
        placeholder="Name"
        className={clsx("my-2 w-fit")}
        value={name}
        onChange={updateName}
      />
      <Selector active={type} options={types} setter={setType}></Selector>

      <Button
        onClick={() => void create()}
        className="mt-5"
        isActive={!nameValidationFail}
        fill={true}
      >
        Create
      </Button>
    </Page>
  );
};

export default Create;
