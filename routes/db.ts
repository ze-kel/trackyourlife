import { randomUUID } from "crypto";
import fs from "fs";
import { ITrackable, ITrackableUnsaved, ITrackableUpdate } from "@t/trackable";

import _merge from "lodash/merge";

// TODO: SWITCH TO REAL DB
let data: ITrackable[];

const getData = () => {
  if (!data) {
    const content = fs.readFileSync("data.json").toString();
    const jsn = JSON.parse(content);

    data = jsn.data;
  }
  return data;
};

const saveData = () => {
  if (!data) return;

  const jsn = JSON.stringify({ data: data }, null, 2);

  fs.writeFileSync("data.json", jsn);
};

const getTrackables = () => {
  const data = getData();

  return data;
};

const getTrackable = (id: ITrackable["id"]) => {
  const data = getData();

  const item = data.find((i) => i.id === id);
  return item;
};

const addTrackable = (toSave: ITrackableUnsaved) => {
  const withId: ITrackable = { ...toSave, id: randomUUID() };
  const data = getData();
  data.push(withId);
  saveData();
  return withId;
};

const updateTrackable = (id: ITrackable["id"], updates: ITrackableUpdate) => {
  const data = getData();

  let itemIndex = data.findIndex((i) => i.id === id);
  console.log("index is", itemIndex);

  data[itemIndex] = _merge(data[itemIndex], updates);

  console.log("updated", data[itemIndex]);

  saveData();
  return data[itemIndex];
};

const deleteTrackable = (id: ITrackable["id"]) => {
  const data = getData();
  let itemIndex = data.findIndex((i) => i.id === id);

  data.splice(itemIndex);
  saveData();
};

const fakeDb = {
  getTrackable,
  getTrackables,
  addTrackable,
  updateTrackable,
  deleteTrackable,
};

export default fakeDb;
