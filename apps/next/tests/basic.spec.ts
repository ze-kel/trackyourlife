import type { ITrackable } from "@tyl/validators/trackable";
import type { Page } from "../playwright/fixtures";
import { test, expect } from "../playwright/fixtures";

const URL = process.env.TEST_URL as string;

// CASES TODO:
// CREATE DELETE
// UPDATE FOR EACH
// CHANGES PERSIST AFTER RELOAD
// ALL SETTINGS PROPERTIES CAN BE SET
// SETTINGS ARE SAVED AND WORK OVERALL

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
  await page.getByRole("radio", { name: type }).click();
  if (name) {
    await page.getByPlaceholder("Name").fill(name);
  }
  await page.getByRole("button", { name: "Create Trackable" }).click();

  await page.waitForURL("**/trackables/**");
};

test("Basic CRUD", async ({ page }) => {
  const TRACKABLE_NAME = "test-bool-" + Math.random();

  await createTrackable({ page, name: TRACKABLE_NAME, type: "boolean" });

  // Return to main page
  await page.goto(URL + "/trackables");

  // Check for link to trackable
  const BOOL_BUTTON = page.getByRole("link", {
    name: TRACKABLE_NAME,
    exact: true,
  });
  await expect(BOOL_BUTTON).toBeVisible();

  // Go to trackable page
  await BOOL_BUTTON.click();
  await page.waitForURL("**/trackables/**");

  // Click first day
  const firstCall = page.waitForResponse((response) => {
    return response.url().includes("trackables");
  });
  const todayCell = page.getByRole("button", {
    name: String(1),
    exact: true,
  });
  expect(await todayCell.getAttribute("data-value")).toBe("false");
  await todayCell.click();
  expect(await todayCell.getAttribute("data-value")).toBe("true");

  // Go to previous month
  await page.getByRole("button", { name: "previous month" }).click();

  // Click random day(but not first)
  const dayFromPreviousM = Math.round(Math.random() * 20) + 1;
  const monthAgoCell = page.getByRole("button", {
    name: String(dayFromPreviousM),
    exact: true,
  });

  await firstCall;

  const secondCall = page.waitForResponse((response) => {
    return response.url().includes("trackables");
  });

  expect(await monthAgoCell.getAttribute("data-value")).toBe("false");
  await monthAgoCell.click();
  expect(await monthAgoCell.getAttribute("data-value")).toBe("true");
  await secondCall;

  // Reload page. Verify that day we clicked on still true
  await page.reload();
  expect(await monthAgoCell.getAttribute("data-value")).toBe("true");
  // For current month too
  await page.getByRole("button", { name: "next month" }).click();
  expect(await todayCell.getAttribute("data-value")).toBe("true");

  // Delele trackable
  await page.locator('button[name="delete"]').click();
  // Button in confirmation modal
  await page.getByRole("button", { name: "Delete" }).click();

  // Expect redirect to main
  await page.waitForURL(URL);

  expect(await BOOL_BUTTON.count()).toEqual(0);
});
