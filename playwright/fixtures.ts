import { test as baseTest, request } from "@playwright/test";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export * from "@playwright/test";

const URL = process.env.TEST_URL as string;

export const test = baseTest.extend<object, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({}, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`,
      );

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.
      const account = {
        email: `${uuid()}@test.com`,
        password: uuid(),
        username: "autotester",
        role: "autotester",
      };

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const context = await request.newContext({ storageState: undefined });

      const r = await context.post(URL + "/api/user/create", {
        data: { ...account },
      });

      console.log(r);

      await context.storageState({ path: fileName });
      await context.dispose();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});
