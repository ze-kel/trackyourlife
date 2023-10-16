import { test, expect } from "../playwright/fixtures";

const URL = process.env.TEST_URL as string;

test.setTimeout(15000);

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

test("has title", async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TrackYourLife/);

  await expect(page.getByText("Your Trackables")).toBeVisible();
});
