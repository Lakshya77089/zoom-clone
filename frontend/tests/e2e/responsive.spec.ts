import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, openDashboard, startNewMeeting, VIEWPORTS } from "./support";

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`${name} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("dashboard, meetings and join pages have no horizontal overflow", async ({ page }) => {
      await openDashboard(page);
      await expectNoHorizontalOverflow(page);
      await expect(page.getByTestId("new-meeting-button")).toBeInViewport();

      for (const path of ["/meetings", "/settings", "/join"]) {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expectNoHorizontalOverflow(page);
      }
    });

    test("modals fit inside the viewport", async ({ page }) => {
      await openDashboard(page);
      await page.getByTestId("schedule-meeting-button").click();
      const dialog = page.getByTestId("schedule-meeting-modal");
      const box = (await dialog.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      expect(box.height).toBeLessThanOrEqual(viewport.height);
      await expect(page.getByTestId("schedule-submit")).toBeVisible();
    });

    test("meeting controls stay reachable", async ({ page }) => {
      await startNewMeeting(page);
      await expectNoHorizontalOverflow(page);
      for (const id of ["toggle-audio", "toggle-video", "participants-button", "more-button", "leave-meeting"]) {
        await expect(page.getByTestId(id)).toBeInViewport();
      }
    });
  });
}

test.describe("navigation adapts to screen size", () => {
  test("mobile uses a bottom tab bar", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await openDashboard(page);
    const tabs = page.getByTestId("mobile-tab-bar");
    await expect(tabs).toBeVisible();
    await tabs.getByRole("link", { name: "Meetings" }).click();
    await expect(page).toHaveURL(/\/meetings$/);
    await expect(page.getByTestId("header-search")).toBeHidden();
  });

  test("desktop uses the side rail", async ({ page }) => {
    await openDashboard(page);
    await expect(page.getByTestId("mobile-tab-bar")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Meetings" })).toBeVisible();
  });
});
