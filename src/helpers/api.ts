import { ITrackable, ITrackableUnsaved, ITrackableUpdate } from "@t/trackable";

const BASE_URL = "http://localhost:1337/api/v1";

const getAll = async () => {
  const res = await fetch(BASE_URL + "/trackables");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const json = await res.json();
  return json as ITrackable[];
};

const getAllIds = async () => {
  const res = await fetch(BASE_URL + "/trackables/id");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const json = await res.json();
  return json as ITrackable["_id"][];
};

const getSingle = async (id: ITrackable["_id"]) => {
  const res = await fetch(BASE_URL + "/trackable/" + id);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await res.json();
  return json as ITrackable;
};

const add = async (data: ITrackableUnsaved) => {
  const res = await fetch(BASE_URL + "/trackables", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await res.json();
  return json as ITrackable;
};

const remove = async (id: ITrackable["_id"]) => {
  const res = await fetch(BASE_URL + "/trackable/" + id, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return;
};

const update = async (id: ITrackable["_id"], updates: ITrackableUpdate) => {
  const res = await fetch(BASE_URL + "/trackable/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await res.json();
  return json as ITrackable;
};

const updateSettings = async (
  id: ITrackable["_id"],
  updates: ITrackable["settings"]
) => {
  const res = await fetch(BASE_URL + "/trackable/" + id + "/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await res.json();
  return json as ITrackable["settings"];
};

export { getAll, getSingle, add, remove, update, updateSettings, getAllIds };
