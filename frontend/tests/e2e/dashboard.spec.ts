import { expect, test } from "@playwright/test";
import { openDashboard, scheduleViaApi, uniqueTitle } from "./support";

test.describe("Dashboard", () => {
  test("loads the header, actions and meeting sections", async ({ page }) => {
    await openDashboard(page);

    await expect(page.getByRole("link", { name: "Zoom Workplace home" })).toBeVisible();
    await expect(page.getByTestId("clock-date")).toContainText(/(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day, /);
    await expect(page.getByTestId("new-meeting-button")).toBeVisible();
    await expect(page.getByTestId("join-meeting-button")).toBeVisible();
    await expect(page.getByTestId("schedule-meeting-button")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Upcoming meetings" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent meetings" })).toBeVisible();
    await expect(page.getByTestId("clock-time")).toHaveText(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  test("shows meeting cards with title, time, duration and meeting ID", async ({ page, request }) => {
    const title = uniqueTitle("Card details");
    const meeting = await scheduleViaApi(request, title, { minutesFromNow: 90, duration: 45 });
    await openDashboard(page);

    const card = page.locator(`[data-meeting-code="${meeting.meeting_code}"]`);
    await expect(card.getByTestId("meeting-title")).toHaveText(title);
    await expect(card).toContainText("45 min");
    await expect(card).toContainText(/\d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)/);
    await expect(card).toContainText(`Meeting ID: ${meeting.meeting_code.slice(0, 3)}`);
    await expect(card.getByTestId("meeting-start-button")).toHaveText("Start");
  });

  test("opens the profile menu and navigates to the profile placeholder", async ({ page }) => {
    await openDashboard(page);
    await page.getByTestId("profile-button").click();
    const menu = page.getByTestId("profile-menu");
    await expect(menu).toBeVisible();
    await expect(menu).toContainText("Basic");

    await menu.getByRole("menuitem", { name: "Profile" }).click();
    await expect(page).toHaveURL(/\/settings#profile$/);
    await expect(page.getByTestId("profile-section")).toBeVisible();
  });

  test("settings button opens the settings page", async ({ page }) => {
    await openDashboard(page);
    await page.getByTestId("settings-button").click();
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
    await expect(page.getByRole("switch")).toHaveCount(3);
  });

  test("header search filters the meetings page", async ({ page, request }) => {
    const title = uniqueTitle("Searchable");
    const meeting = await scheduleViaApi(request, title);
    await openDashboard(page);

    await page.getByTestId("header-search").fill(title);
    await page.getByTestId("header-search").press("Enter");
    await expect(page).toHaveURL(/\/meetings\?q=/);
    await expect(page.getByTestId("upcoming-meeting")).toHaveCount(1);
    await expect(page.getByTestId("meeting-title")).toHaveText(title);

    await page.getByTestId("meetings-search").fill("no meeting has this name");
    await expect(page.getByTestId("search-empty")).toBeVisible();

    await page.getByTestId("meetings-search").fill(meeting.meeting_code.replace(/(\d{3})(\d{4})(\d+)/, "$1 $2 $3"));
    await expect(page.getByTestId("upcoming-meeting")).toHaveCount(1);
    await expect(page.getByTestId("meeting-title")).toHaveText(title);
  });
});
