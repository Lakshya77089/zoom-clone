Cypress.Commands.add("getByTestId", (testId: string) => cy.get(`[data-testid="${testId}"]`));

Cypress.Commands.add("visitDashboard", () => {
  cy.visit("/");
  cy.getByTestId("dashboard").should("be.visible");
  cy.get('[aria-label="Loading meetings"]').should("not.exist");
});

Cypress.Commands.add("scheduleMeeting", (title: string, minutesFromNow = 120) => {
  const start = new Date(Date.now() + minutesFromNow * 60_000).toISOString();
  return cy
    .request<MeetingResponse>("POST", "/api/meetings", { title, start_time: start, duration_minutes: 30 })
    .its("body");
});

Cypress.Commands.add("startInstantMeeting", () =>
  cy.request<{ meeting: MeetingResponse }>("POST", "/api/meetings/instant").its("body.meeting"),
);

Cypress.Commands.add("showUpcomingDay", (start: string) => {
  const dayStart = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((dayStart(new Date(start)) - dayStart(new Date())) / 86_400_000);
  cy.getByTestId("calendar-today").click();
  for (let step = 0; step < days; step++) cy.getByTestId("calendar-next").click();
});
