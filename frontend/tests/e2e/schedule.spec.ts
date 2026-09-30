import { expect, test } from "@playwright/test";
import { openDashboard, scheduleViaApi, uniqueTitle } from "./support";

function inputDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

test.describe("Schedule meeting", () => {
  test("schedules a meeting and shows it in Upcoming", async ({ page }) => {
    const title = uniqueTitle("Quarterly Planning");
    const tomorrow = new Date(Date.now() + 86_400_000);
    await openDashboard(page);

    await page.getByTestId("schedule-meeting-button").click();
    await expect(page.getByTestId("schedule-meeting-modal")).toBeVisible();
    await page.getByTestId("schedule-title-input").fill(title);
    await page.getByTestId("schedule-add-description").click();
    await page.getByTestId("schedule-description-input").fill("Roadmap and hiring plan");
    await page.getByTestId("schedule-date-input").fill(inputDate(tomorrow));
    await page.getByTestId("schedule-time-input").fill("15:30");
    await page.getByTestId("schedule-duration-hours").selectOption("1");
    await page.getByTestId("schedule-duration-minutes").selectOption("30");
    await page.getByTestId("schedule-submit").click();

    const summary = page.getByTestId("scheduled-summary");
    await expect(summary).toContainText(title);
    await expect(summary).toContainText("1 hr 30 min");
    await expect(summary).toContainText("3:30 PM - 5:00 PM");
    await expect(page.getByTestId("scheduled-meeting-id")).toHaveText(/^\d{3} \d{4} \d{4}$/);
    await expect(page.getByTestId("scheduled-invite-link")).toHaveText(/\/j\/\d{11}$/);

    await page.getByTestId("schedule-done").click();
    const card = page.getByTestId("upcoming-meeting").filter({ hasText: title });
    await expect(card).toBeVisible();
    await expect(card).toContainText("1 hr 30 min");
  });

  test("validates topic, past start time and minimum duration", async ({ page }) => {
    await openDashboard(page);
    await page.getByTestId("schedule-meeting-button").click();
    await expect(page.getByTestId("schedule-title-input")).toHaveValue(/'s Zoom Meeting$/);

    await page.getByTestId("schedule-title-input").fill("");
    await page.getByTestId("schedule-date-input").fill(inputDate(new Date(Date.now() - 86_400_000 * 2)));
    await page.getByTestId("schedule-duration-hours").selectOption("0");
    await page.getByTestId("schedule-duration-minutes").selectOption("0");
    await page.getByTestId("schedule-submit").click();

    const errors = page.getByTestId("field-error");
    await expect(errors).toHaveCount(3);
    await expect(errors.nth(0)).toHaveText("Please enter a meeting topic.");
    await expect(errors.nth(1)).toHaveText("Meeting start time must be in the future.");
    await expect(errors.nth(2)).toHaveText("Duration must be at least 15 minutes.");
    await expect(page.getByTestId("schedule-meeting-modal")).toBeVisible();
  });

  test("meeting card Start opens the scheduled meeting as host", async ({ page, request }) => {
    const title = uniqueTitle("Card Start");
    const meeting = await scheduleViaApi(request, title);
    await openDashboard(page);

    await page.locator(`[data-meeting-code="${meeting.meeting_code}"]`).getByTestId("meeting-start-button").click();
    await expect(page).toHaveURL(new RegExp(`/wc/${meeting.meeting_code}$`));
    await expect(page.getByTestId("room-title")).toHaveText(title);
    await expect(page.getByTestId("leave-meeting")).toHaveText("End");
  });

  test("meeting card menu deletes a scheduled meeting after confirmation", async ({ page, request }) => {
    const title = uniqueTitle("Delete Me");
    const meeting = await scheduleViaApi(request, title);
    await openDashboard(page);

    const card = page.locator(`[data-meeting-code="${meeting.meeting_code}"]`);
    await card.getByTestId("meeting-more-button").click();
    await page.getByTestId("delete-meeting").click();
    await expect(page.getByTestId("confirm-dialog")).toContainText(title);
    await page.getByTestId("confirm-button").click();

    await expect(page.getByTestId("toast")).toHaveText("Meeting deleted");
    await expect(card).toHaveCount(0);
    const response = await request.get(`/api/meetings/${meeting.meeting_code}`);
    expect(response.status()).toBe(404);
  });

  test("meeting card menu copies the invite link", async ({ page, request }) => {
    const meeting = await scheduleViaApi(request, uniqueTitle("Copy Link"));
    await openDashboard(page);

    await page.locator(`[data-meeting-code="${meeting.meeting_code}"]`).getByTestId("meeting-more-button").click();
    await page.getByTestId("copy-invite-link").click();
    await expect(page.getByTestId("toast")).toHaveText("Invite link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(new RegExp(`/j/${meeting.meeting_code}$`));
  });
});
