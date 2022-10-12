import { randomUUID } from "crypto";
import request from "supertest";
import {
  ITrackable,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "../types/trackable";
import _cloneDeep from "lodash/cloneDeep";

const BASE_URL = "http://localhost:1337/api/v1";

const getAll = async () => {
  const response = await request(BASE_URL).get("/trackables");
  return response.body as ITrackable[];
};

const getSingle = async (_id: ITrackable["_id"]) => {
  const response = await request(BASE_URL).get("/trackable/" + _id);
  return response.body;
};

const add = async (data: ITrackableUnsaved) => {
  const response = await request(BASE_URL).post("/trackables").send(data);
  return response.body as ITrackable;
};

const remove = async (_id: ITrackable["_id"]) => {
  const response = await request(BASE_URL).delete("/trackable/" + _id);
  return;
};

const update = async (_id: ITrackable["_id"], updates: ITrackableUpdate) => {
  const response = await request(BASE_URL)
    .put("/trackable/" + _id)
    .send(updates);
  return response.body as ITrackable;
};

const updateSettings = async (
  _id: ITrackable["_id"],
  settings: ITrackable["settings"]
) => {
  const response = await request(BASE_URL)
    .put("/trackable/" + _id + "/settings")
    .send(settings);
  return response.body as ITrackable["settings"];
};

describe("API TEST", () => {
  const toDelete = [];

  afterAll(async () => {
    toDelete.forEach(async (_id) => {
      await remove(_id);
    });
  });

  test("Get all", async () => {
    const all = await getAll();
    expect(all).toBeInstanceOf(Array);
  });

  test("Adding", async () => {
    const allBefore = await getAll();

    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added = await add(mock);

    expect(added.type).toEqual(mock.type);
    expect(added.settings).toEqual(mock.settings);
    expect(added.data).toEqual(mock.data);
    expect(added._id).toBeDefined();

    const allAfter = await getAll();
    const shouldBeAfter = _cloneDeep(allBefore);
    shouldBeAfter.push(added);

    expect(allAfter).toEqual(shouldBeAfter);
    toDelete.push(added._id);
  });

  test("Deletion", async () => {
    const allBefore = await getAll();

    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added1 = await add(mock);
    const added2 = await add(mock);

    const allAfterAdding = await getAll();

    expect(allAfterAdding.length).toBe(allBefore.length + 2);

    await remove(added2._id);

    const allAfterDeletion = await getAll();

    expect(allAfterDeletion.length).toBe(allBefore.length + 1);

    const shouldBeAfter = _cloneDeep(allBefore);
    shouldBeAfter.push(added1);
    expect(allAfterDeletion).toEqual(shouldBeAfter);

    toDelete.push(added1._id);
  });

  test("Getting individual", async () => {
    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added = await add(mock);

    const fetched = await getSingle(added._id);

    expect(added).toEqual(fetched);
  });

  test("Update", async () => {
    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added = await add(mock);

    const upd1: ITrackableUpdate = {
      year: 2022,
      month: 8,
      day: 8,
      value: true,
    };

    const afterUpd1 = await update(added._id, upd1);

    expect(afterUpd1.data["2022-09-08"]).toEqual(true);

    const upd2: ITrackableUpdate = {
      year: 2022,
      month: 8,
      day: 10,
      value: true,
    };

    const afterUpd2 = await update(added._id, upd2);

    expect(afterUpd2.data["2022-09-10"]).toEqual(true);

    const fullFetch = await getSingle(added._id);
    expect(fullFetch).toEqual(afterUpd2);

    toDelete.push(fullFetch.id);
  });

  test("Settings Update", async () => {
    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added = await add(mock);

    const newSettings = { ...added.settings };

    newSettings.name = randomUUID();

    const updSetitngs = await updateSettings(added._id, newSettings);

    const refetched = await getSingle(added._id);

    expect(updSetitngs).toEqual(newSettings);

    expect(refetched).toEqual({ ...added, settings: newSettings });

    toDelete.push(added._id);
  });
});

export {};
