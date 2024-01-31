import type { ITrackable } from "@t/trackable";
import type { Page } from "../playwright/fixtures";
import { test, expect } from "../playwright/fixtures";

const URL = process.env.TEST_URL as string;

// CASES TODO:
// CREATE DELETE
// UPDATE FOR EACH
// CHANGES PERSIST AFTER RELOAD
// ALL SETTINGS PROPERTIES CAN BE SET
// SETTINGS ARE SAVED AND WORK OVERALL

const CURRENT_DAY = new Date().getDate();

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

test("CRUD: Boolean", async ({ page }) => {
  const BOOL_NAME = "test-bool";

  await createTrackable({ page, name: BOOL_NAME, type: "boolean" });

  // Return to main page
  await page.goto(URL);

  // Check for link to trackable
  const BOOL_BUTTON = page.getByRole("link", { name: BOOL_NAME, exact: true });
  await expect(BOOL_BUTTON).toBeVisible();

  // Go to trackable page
  await BOOL_BUTTON.click();
  await page.waitForURL("**/trackables/**");

  const todayCell = page.getByRole("button", {
    name: String(CURRENT_DAY),
    exact: true,
  });

  expect(await todayCell.getAttribute("data-value")).toBe("false");

  // Click today
  await todayCell.click();

  expect(await todayCell.getAttribute("data-value")).toBe("true");

  // Delele trackable
  await page.locator('button[name="delete"]').click();
  // Button in confirmation modal
  await page.getByRole("button", { name: "Delete" }).click();

  // Expect redirect to main
  await page.waitForURL(URL);

  expect(await BOOL_BUTTON.count()).toEqual(0);
});
