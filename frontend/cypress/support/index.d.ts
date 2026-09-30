interface MeetingResponse {
  meeting_code: string;
  title: string;
  invite_link: string;
  scheduled_start: string | null;
}

declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    visitDashboard(): Chainable<void>;
    scheduleMeeting(title: string, minutesFromNow?: number): Chainable<MeetingResponse>;
    startInstantMeeting(): Chainable<MeetingResponse>;
    showUpcomingDay(start: string): Chainable<void>;
  }
}
