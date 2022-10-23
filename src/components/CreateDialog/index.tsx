import Button from "@components/_UI/Button";
import Selector, { ISelectorOption } from "@components/_UI/Selector";
import { ITrackableUnsaved } from "@t/trackable";
import clsx from "clsx";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { add } from "src/helpers/api";

const CreateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [name, setName] = useState<ITrackableUnsaved["settings"]["name"]>("");
  const [type, setType] = useState<ITrackableUnsaved["type"]>("boolean");

  const [nameValidationFail, setNameValidationFail] = useState(false);

  const types: ISelectorOption[] = [
    { label: "Boolean", value: "boolean" },
    { label: "Number", value: "number" },
    { label: "Range", value: "Range" },
  ];

  const router = useRouter();

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

    const saved = await add(newOne as ITrackableUnsaved);

    router.push(`/trackable/${saved._id}`);
    onSuccess();
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
    <>
      <h3 className="text-2xl font-bold">Create new Trackable</h3>
      <input
        placeholder="Name"
        className={clsx(
          "text-md my-2 border p-1",
          nameValidationFail && "border-red-600"
        )}
        value={name}
        onChange={updateName}
      />
      <Selector active={type} options={types} setter={setType}></Selector>

      <Button
        click={create}
        className="mt-5"
        isActive={!nameValidationFail}
        fill={true}
      >
        Create
      </Button>
    </>
  );
};

export default CreateDialog;
