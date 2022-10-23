import Page from "@components/Page";
import Selector, { ISelectorOption } from "@components/_UI/Selector";
import { ITrackable, ITrackableUnsaved } from "@t/trackable";
import { useRouter } from "next/router";
import { useState } from "react";
import { add } from "src/helpers/api";

export default function Home() {
  const [name, setName] = useState<ITrackableUnsaved["settings"]["name"]>("");
  const [type, setType] = useState<ITrackableUnsaved["type"]>("boolean");

  const types: ISelectorOption[] = [
    { label: "Boolean", value: "boolean" },
    { label: "Number", value: "number" },
    { label: "Range", value: "Range" },
  ];

  const router = useRouter();

  const create = async () => {
    const newOne = {
      type: type,
      settings: {
        name,
      },
      data: {},
    };

    const saved = await add(newOne as ITrackableUnsaved);

    router.push(`/trackable/${saved._id}`);
  };

  return (
    <Page>
      <input
        placeholder="Name"
        className="text-md my-2 border p-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Selector active={type} options={types} setter={setType}></Selector>

      <button onClick={create}>Create</button>
    </Page>
  );
}
