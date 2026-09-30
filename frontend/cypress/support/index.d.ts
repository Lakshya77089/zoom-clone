interface MeetingResponse {
  meeting_code: string;
  title: string;
  invite_link: string;
}

declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    visitDashboard(): Chainable<void>;
    scheduleMeeting(title: string, minutesFromNow?: number): Chainable<MeetingResponse>;
    startInstantMeeting(): Chainable<MeetingResponse>;
  }
}
