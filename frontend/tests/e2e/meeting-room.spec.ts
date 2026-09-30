import { expect, test } from "@playwright/test";
import { joinFromInviteLink, startNewMeeting } from "./support";

test.describe("Meeting room", () => {
  test("toolbar toggles microphone and camera state", async ({ page }) => {
    await startNewMeeting(page);
    const audio = page.getByTestId("toggle-audio");
    const video = page.getByTestId("toggle-video");

    await expect(audio).toHaveAttribute("data-state", "on");
    await audio.click();
    await expect(audio).toHaveAttribute("data-state", "off");
    await expect(audio).toHaveAccessibleName("Unmute");
    await expect(page.getByTestId("video-tile").first()).toHaveAttribute("data-muted", "true");

    await video.click();
    await expect(video).toHaveAttribute("data-state", "off");
    await expect(video).toHaveAccessibleName("Start Video");

    await page.reload();
    await expect(page.getByTestId("toggle-audio")).toHaveAttribute("data-state", "off");
    await expect(page.getByTestId("toggle-video")).toHaveAttribute("data-state", "off");
  });

  test("participants panel lists everyone and host can mute all", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    const guest = await browser.newPage({ baseURL });
    await joinFromInviteLink(guest, code, "Taylor Guest");

    await page.getByTestId("participants-button").click();
    const panel = page.getByTestId("participants-panel");
    await expect(panel.getByTestId("participant-row")).toHaveCount(2);
    await expect(panel).toContainText("(Host, me)");
    await expect(panel).toContainText("Taylor Guest");

    await panel.getByTestId("mute-all").click();
    await expect(page.getByTestId("toast")).toHaveText("All participants have been muted");
    await expect(guest.getByTestId("toggle-audio")).toHaveAttribute("data-state", "off", { timeout: 10_000 });
    await guest.close();
  });

  test("host can remove a participant", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    const guest = await browser.newPage({ baseURL });
    await joinFromInviteLink(guest, code, "Removable Guest");

    await page.getByTestId("participants-button").click();
    const row = page.getByTestId("participant-row").filter({ hasText: "Removable Guest" });
    await row.hover();
    await row.getByTestId("remove-participant").click();
    await page.getByTestId("confirm-button").click();

    await expect(page.getByTestId("participant-row")).toHaveCount(1);
    await expect(guest.getByTestId("room-notice")).toHaveText("You have been removed from this meeting", { timeout: 10_000 });
    await guest.close();
  });

  test("more menu copies the invite link", async ({ page }) => {
    const code = await startNewMeeting(page);
    await page.getByTestId("more-button").click();
    await page.getByTestId("more-copy-link").click();
    await expect(page.getByTestId("toast")).toHaveText("Invite link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(new RegExp(`/j/${code}$`));
  });

  test("attendee leaving returns to the dashboard", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    const guest = await browser.newPage({ baseURL });
    await joinFromInviteLink(guest, code, "Leaving Guest");

    await expect(guest.getByTestId("leave-meeting")).toHaveText("Leave");
    await guest.getByTestId("leave-meeting").click();
    await expect(guest.getByTestId("end-for-all")).toHaveCount(0);
    await guest.getByTestId("leave-confirm").click();
    await expect(guest).toHaveURL(/\/$/);
    await expect(guest.getByTestId("dashboard")).toBeVisible();

    await page.getByTestId("participants-button").click();
    await expect(page.getByTestId("participant-row")).toHaveCount(1);
    await guest.close();
  });

  test("ending the meeting for all shows the ended notice to attendees", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    const guest = await browser.newPage({ baseURL });
    await joinFromInviteLink(guest, code, "Ended Guest");

    await page.getByTestId("leave-meeting").click();
    await page.getByTestId("end-for-all").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(guest.getByTestId("room-notice")).toHaveText("This meeting has been ended by host", { timeout: 10_000 });
    await guest.close();
  });
});
