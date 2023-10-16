import type { ITrackable } from "@t/trackable";
import type { Page, TestInfo } from "../playwright/fixtures";
import { test, expect } from "../playwright/fixtures";

const URL = process.env.TEST_URL as string;

test.setTimeout(15000);

// CASES TODO:
// CREATE DELETE
// UPDATE FOR EACH
// CHANGES PERSIST AFTER RELOAD
// ALL SETTINGS PROPERTIES CAN BE SET
// SETINGS ARE SAVED AND WORK OVERALL

//const CURRENT_DAY = new Date().getDay();

export async function screenshotOnFailure(
  { page }: { page: Page },
  testInfo: TestInfo,
) {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Get a unique place for the screenshot.
    const screenshotPath = testInfo.outputPath(`failure.png`);
    // Add it to the report.
    testInfo.attachments.push({
      name: "screenshot",
      path: screenshotPath,
      contentType: "image/png",
    });
    // Take the screenshot itself.
    await page.screenshot({ path: screenshotPath, timeout: 5000 });
  }
}

const createTrackable = async ({
  page,
  type,
  name,
}: {
  type: ITrackable["type"];
  name: ITrackable["settings"]["name"];
  page: Page;
}) => {
  await page.goto(URL + "/create");
  // Creating
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("radio", { name: type }).click();
  if (name) {
    await page.getByPlaceholder("Name").fill(name);
  }
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL("**/trackables/**");
};

test("Create, update, delete", async ({ page }) => {
  const BOOL_NAME = "test-bool";

  await createTrackable({ page, name: BOOL_NAME, type: "boolean" });

  // Return to main page
  await page.goto(URL);

  // Check for link to trackable
  const BOOL_BUTTON = page.getByRole("link", { name: BOOL_NAME, exact: true });
  await expect(BOOL_BUTTON).toBeVisible();

  /*

  await page.getByRole("radio", { name: "Number" }).click();
  await page.getByRole("radio", { name: "Range" }).click();

  await page.locator('button[name="prevous month"]').click();

  await page.getByRole("button", { name: "1", exact: true }).click();
  await page.getByRole("button", { name: "10" }).click();
  await page.getByRole("button", { name: "20" }).click();

  await page.reload();

  await page.locator('button[name="prevous month"]').click();

  await page.getByRole("button", { name: "Delete" }).click();
  await page.goto("http://localhost:3000/");
  */
});
