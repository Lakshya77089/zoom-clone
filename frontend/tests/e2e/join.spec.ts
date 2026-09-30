import { expect, test } from "@playwright/test";
import { openDashboard, startInstantViaApi } from "./support";

const UNKNOWN_CODE = "99999999999";

test.describe("Join meeting", () => {
  test.beforeEach(async ({ page }) => {
    await openDashboard(page);
    await page.getByTestId("join-meeting-button").click();
    await expect(page.getByTestId("join-meeting-modal")).toBeVisible();
  });

  test("keeps Join disabled until a meeting ID is entered", async ({ page }) => {
    await expect(page.getByTestId("join-submit")).toBeDisabled();
    await page.getByTestId("meeting-id-input").fill("1");
    await expect(page.getByTestId("join-submit")).toBeEnabled();
  });

  test("shows an error for a malformed meeting ID", async ({ page }) => {
    await page.getByTestId("meeting-id-input").fill("12345");
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error")).toHaveText(/not valid/);
    await expect(page.getByTestId("meeting-id-input")).toHaveAttribute("aria-invalid", "true");
  });

  test("shows an error when the meeting does not exist", async ({ page }) => {
    await page.getByTestId("meeting-id-input").fill(UNKNOWN_CODE);
    await page.getByTestId("display-name-input").fill("Guest Tester");
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error")).toHaveText("Invalid meeting ID. Please check and try again.");
    await expect(page).toHaveURL(/\/$/);
  });

  test("requires a display name", async ({ page, request }) => {
    const { meeting } = await startInstantViaApi(request);
    await page.getByTestId("meeting-id-input").fill(meeting.meeting_code);
    await page.getByTestId("display-name-input").fill("   ");
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error")).toHaveText("Please enter your name.");
  });

  test("joins by meeting ID with the chosen name and media settings", async ({ page, request }) => {
    const { meeting } = await startInstantViaApi(request);
    await page.getByTestId("meeting-id-input").fill(meeting.meeting_code.replace(/(\d{3})(\d{4})(\d+)/, "$1 $2 $3"));
    await page.getByTestId("display-name-input").fill("Jordan Lee");
    await page.getByLabel("Don't connect to audio").check();
    await page.getByTestId("join-submit").click();

    await expect(page).toHaveURL(new RegExp(`/wc/${meeting.meeting_code}$`));
    await expect(page.getByTestId("meeting-room")).toBeVisible();
    await expect(page.getByTestId("toggle-audio")).toHaveAttribute("data-state", "off");
    await page.getByTestId("participants-button").click();
    await expect(page.getByTestId("participants-panel")).toContainText("Jordan Lee (me)");
  });

  test("joins by pasting a full invite link", async ({ page, request }) => {
    const { meeting } = await startInstantViaApi(request);
    await page.getByTestId("meeting-id-input").fill(meeting.invite_link);
    await page.getByTestId("display-name-input").fill("Link Guest");
    await page.getByTestId("join-submit").click();
    await expect(page).toHaveURL(new RegExp(`/wc/${meeting.meeting_code}$`));
  });
});

test.describe("Invite link and /join page", () => {
  test("pre-join screen validates the display name before joining", async ({ page, request }) => {
    const { meeting } = await startInstantViaApi(request);
    await page.goto(`/j/${meeting.meeting_code}`);
    await expect(page.getByTestId("prejoin-title")).toHaveText(meeting.title);

    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error")).toHaveText("Please enter your name.");

    await page.getByTestId("display-name-input").fill("Invite Guest");
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("meeting-room")).toBeVisible();
  });

  test("invalid invite link shows the invalid meeting state", async ({ page }) => {
    await page.goto(`/j/${UNKNOWN_CODE}`);
    await expect(page.getByTestId("prejoin-error")).toContainText("Invalid meeting ID");
    await page.getByRole("link", { name: "Enter a different ID" }).click();
    await expect(page).toHaveURL(/\/join$/);
  });

  test("/join validates the meeting before asking for a name", async ({ page, request }) => {
    const { meeting } = await startInstantViaApi(request);
    await page.goto("/join");
    await page.getByTestId("meeting-id-input").fill(UNKNOWN_CODE);
    await page.getByTestId("join-submit").click();
    await expect(page.getByTestId("field-error")).toHaveText("Invalid meeting ID. Please check and try again.");

    await page.getByTestId("meeting-id-input").fill(meeting.meeting_code);
    await page.getByTestId("join-submit").click();
    await expect(page).toHaveURL(new RegExp(`/j/${meeting.meeting_code}$`));
    await expect(page.getByTestId("display-name-input")).toBeVisible();
  });
});
