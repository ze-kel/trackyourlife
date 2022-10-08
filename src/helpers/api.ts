import { ITrackable, ITrackableUnsaved, ITrackableUpdate } from "@t/trackable";

const BASE_URL = "http://localhost:1337/api/v1";

const getAll = async () => {
  const res = await fetch(BASE_URL + "/trackables");
  const json = await res.json();
  return json as ITrackable[];
};

const getSingle = async (id: ITrackable["id"]) => {
  const res = await fetch(BASE_URL + "/trackable/" + id);
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
  const json = await res.json();
  return json as ITrackable[];
};

const remove = async (id: ITrackable["id"]) => {
  const res = await fetch(BASE_URL + "/trackable/" + id, { method: "DELETE" });
  return;
};

const update = async (id: ITrackable["id"], updates: ITrackableUpdate) => {
  const res = await fetch(BASE_URL + "/trackable/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  return json as ITrackable[];
};

export { getAll, getSingle, add, remove, update };
