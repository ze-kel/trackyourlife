import Page from "@components/Page";
import Selector, { ISelectorOption } from "@components/_UI/Selector";
import { ITrackable } from "@t/trackable";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState<ITrackable["settings"]["name"]>("");
  const [type, setType] = useState<ITrackable["type"]>("boolean");

  const types: ISelectorOption[] = [
    { label: "Boolean", value: "boolean" },
    { label: "Number", value: "number" },
    { label: "Range", value: "Range" },
  ];

  return (
    <Page>
      <input
        placeholder="Name"
        className="text-md my-2 border p-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Selector active={type} options={types} setter={setType}></Selector>

      <button>Create</button>
    </Page>
  );
}
