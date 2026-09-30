import { expect, type APIRequestContext, type Page } from "@playwright/test";
import type { Meeting, MeetingSession } from "../../src/types";

export const VIEWPORTS = {
  desktopLarge: { width: 1440, height: 900 },
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
  mobileSmall: { width: 375, height: 812 },
} as const;

export function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

export async function scheduleViaApi(
  request: APIRequestContext,
  title: string,
  { minutesFromNow = 120, duration = 30 } = {},
): Promise<Meeting> {
  const start = new Date(Date.now() + minutesFromNow * 60_000);
  const response = await request.post("/api/meetings", {
    data: { title, start_time: start.toISOString(), duration_minutes: duration },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function startInstantViaApi(request: APIRequestContext): Promise<MeetingSession> {
  const response = await request.post("/api/meetings/instant");
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function openDashboard(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByTestId("upcoming-meetings").getByLabel("Loading meetings")).toHaveCount(0);
}

export async function startNewMeeting(page: Page): Promise<string> {
  await openDashboard(page);
  await page.getByTestId("new-meeting-button").click();
  await expect(page).toHaveURL(/\/wc\/\d{11}$/);
  await expect(page.getByTestId("meeting-room")).toBeVisible();
  return page.url().split("/").pop()!;
}

export async function joinFromInviteLink(page: Page, code: string, name: string): Promise<void> {
  await page.goto(`/j/${code}`);
  await page.getByTestId("display-name-input").fill(name);
  await page.getByTestId("join-submit").click();
  await expect(page.getByTestId("meeting-room")).toBeVisible();
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

export function participantHeaders(session: MeetingSession): Record<string, string> {
  return {
    "X-Participant-Id": String(session.participant.id),
    "X-Participant-Token": session.participant.session_token,
  };
}

export async function endViaApi(request: APIRequestContext, session: MeetingSession): Promise<void> {
  const response = await request.post(`/api/meetings/${session.meeting.meeting_code}/end`, { headers: participantHeaders(session) });
  expect(response.ok()).toBeTruthy();
}
