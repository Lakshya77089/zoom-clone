import { expect, test } from "@playwright/test";
import { participantHeaders, startInstantViaApi } from "./support";

test.describe("Participant session security", () => {
  test("in-room actions require the participant's own session token", async ({ request }) => {
    const host = await startInstantViaApi(request);
    const code = host.meeting.meeting_code;
    const hostId = String(host.participant.id);
    expect(host.participant.session_token.length).toBeGreaterThanOrEqual(32);

    const missing = await request.post(`/api/meetings/${code}/end`, { headers: { "X-Participant-Id": hostId } });
    expect(missing.status()).toBe(422);

    const forged = await request.post(`/api/meetings/${code}/participants/mute-all`, {
      headers: { "X-Participant-Id": hostId, "X-Participant-Token": "guessed-token" },
    });
    expect(forged.status()).toBe(403);

    const guestJoin = await request.post(`/api/meetings/${code}/join`, { data: { display_name: "Curious Guest" } });
    const guest = await guestJoin.json();
    const guestUsingHostId = await request.post(`/api/meetings/${code}/end`, {
      headers: { "X-Participant-Id": hostId, "X-Participant-Token": guest.participant.session_token },
    });
    expect(guestUsingHostId.status()).toBe(403);

    const state = await request.get(`/api/meetings/${code}/state`, { headers: participantHeaders(host) });
    expect(state.ok()).toBeTruthy();
    expect(JSON.stringify(await state.json())).not.toContain("session_token");

    const ended = await request.post(`/api/meetings/${code}/end`, { headers: participantHeaders(host) });
    expect(ended.ok()).toBeTruthy();
  });

  test("a tampered session shows a clear message in the room", async ({ page, request }) => {
    const session = await startInstantViaApi(request);
    await page.goto("/");
    await page.evaluate(({ code, id }) => {
      sessionStorage.setItem(`zoom:participant:${code}`, String(id));
      sessionStorage.setItem(`zoom:participant-token:${id}`, "not-the-real-token");
    }, { code: session.meeting.meeting_code, id: session.participant.id });
    await page.goto(`/wc/${session.meeting.meeting_code}`);
    await expect(page.getByTestId("room-notice")).toHaveText("Your meeting session is no longer valid. Please join the meeting again.");
  });
});
