import { expect, test, type Page } from "@playwright/test";
import { joinFromInviteLink, openDashboard, startNewMeeting, VIEWPORTS } from "./support";

const SCREENSHOT_DIR = "test-results/screenshots";

async function capture(page: Page, name: string) {
  await page.waitForTimeout(300);
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/${name}.png`,
    mask: [page.getByTestId("clock-time")],
    animations: "disabled",
  });
}

test.describe("Visual capture", () => {
  test("dashboard at desktop, tablet and mobile", async ({ page }) => {
    for (const [name, viewport] of [
      ["dashboard-desktop", VIEWPORTS.desktopLarge],
      ["dashboard-tablet", VIEWPORTS.tablet],
      ["dashboard-mobile", VIEWPORTS.mobile],
    ] as const) {
      await page.setViewportSize(viewport);
      await openDashboard(page);
      await capture(page, name);
    }
  });

  test("join and schedule states", async ({ page }) => {
    await openDashboard(page);
    await page.getByTestId("join-meeting-button").click();
    await page.getByTestId("meeting-id-input").fill("123");
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error").first()).toBeVisible();
    await capture(page, "join-meeting");

    await page.keyboard.press("Escape");
    await page.getByTestId("schedule-meeting-button").click();
    await capture(page, "schedule-meeting");
  });

  test("new meeting and meeting room", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    await capture(page, "new-meeting");

    const guest = await browser.newPage({ baseURL });
    await joinFromInviteLink(guest, code, "Sam Rivera");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("video-tile")).toHaveCount(2);
    await capture(page, "meeting-room-desktop");

    await guest.setViewportSize(VIEWPORTS.mobile);
    await capture(guest, "meeting-room-mobile");
    await guest.close();
  });
});
