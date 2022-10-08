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

const getSingle = async (id: ITrackable["id"]) => {
  const response = await request(BASE_URL).get("/trackable/" + id);
  return response.body;
};

const add = async (data: ITrackableUnsaved) => {
  const response = await request(BASE_URL).post("/trackables").send(data);
  return response.body as ITrackable;
};

const remove = async (id: ITrackable["id"]) => {
  const response = await request(BASE_URL).delete("/trackable/" + id);
  return;
};

const update = async (id: ITrackable["id"], updates: ITrackableUpdate) => {
  const response = await request(BASE_URL)
    .put("/trackable/" + id)
    .send(updates);
  return response.body as ITrackable;
};

describe("API TEST", () => {
  const toDelete = [];

  afterAll(async () => {
    toDelete.forEach(async (id) => {
      await remove(id);
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
    expect(added.id).toBeDefined();

    const allAfter = await getAll();
    const shouldBeAfter = _cloneDeep(allBefore);
    shouldBeAfter.push(added);

    expect(allAfter).toEqual(shouldBeAfter);
    toDelete.push(added.id);
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

    await remove(added2.id);

    const allAfterDeletion = await getAll();

    expect(allAfterDeletion.length).toBe(allBefore.length + 1);

    const shouldBeAfter = _cloneDeep(allBefore);
    shouldBeAfter.push(added1);
    expect(allAfterDeletion).toEqual(shouldBeAfter);

    toDelete.push(added1.id);
  });

  test("Getting individual", async () => {
    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {},
    };

    const added = await add(mock);

    const fetched = await getSingle(added.id);

    expect(added).toEqual(fetched);
  });

  test("Update", async () => {
    const mock: ITrackableUnsaved = {
      type: "boolean",
      settings: { name: randomUUID() },
      data: {
        2022: {
          6: {
            1: true,
          },
        },
      },
    };

    const added = await add(mock);

    const upd1: ITrackableUpdate = {
      id: added.id,
      data: {
        2022: {
          9: {
            8: true,
          },
        },
      },
    };

    const afterUpd1 = await update(added.id, upd1);

    const dataShouldBe1 = {
      2022: {
        6: {
          1: true,
        },
        9: {
          8: true,
        },
      },
    };

    expect(afterUpd1.data).toEqual(dataShouldBe1);

    const upd2: ITrackableUpdate = {
      id: added.id,
      data: {
        2022: {
          9: {
            10: true,
          },
        },
      },
    };

    const afterUpd2 = await update(added.id, upd2);

    const dataShouldBe2 = {
      2022: {
        6: {
          1: true,
        },
        9: {
          8: true,
          10: true,
        },
      },
    };

    expect(afterUpd2.data).toEqual(dataShouldBe2);

    const fullFetch = await getSingle(added.id);
    expect(fullFetch).toEqual(afterUpd2);

    toDelete.push(fullFetch.id);
  });
});

export {};
