import { expect, test } from "@playwright/test";
import { startNewMeeting } from "./support";

test.describe("New meeting", () => {
  test("creates a meeting with a unique ID and opens the meeting room", async ({ page }) => {
    const firstCode = await startNewMeeting(page);
    expect(firstCode).toMatch(/^\d{11}$/);

    const info = page.getByTestId("meeting-info");
    await expect(info).toBeVisible();
    await expect(page.getByTestId("room-meeting-id")).toHaveText(`${firstCode.slice(0, 3)} ${firstCode.slice(3, 7)} ${firstCode.slice(7)}`);
    await expect(page.getByTestId("room-invite-link")).toHaveText(new RegExp(`/j/${firstCode}$`));
    await expect(page.getByTestId("room-title")).toHaveText(/Zoom Meeting$/);

    await page.getByTestId("leave-meeting").click();
    await page.getByTestId("end-for-all").click();
    await expect(page).toHaveURL(/\/$/);

    const secondCode = await startNewMeeting(page);
    expect(secondCode).not.toBe(firstCode);
  });

  test("the invite link opens the pre-join screen for that meeting", async ({ page, browser, baseURL }) => {
    const code = await startNewMeeting(page);
    const inviteLink = (await page.getByTestId("room-invite-link").textContent())!;

    const guest = await browser.newPage({ baseURL });
    await guest.goto(new URL(inviteLink).pathname);
    await expect(guest.getByTestId("prejoin-title")).toHaveText(/Zoom Meeting$/);
    await expect(guest.getByText(`Meeting ID: ${code.slice(0, 3)}`)).toBeVisible();
    await guest.close();
  });
});
