describe("Scheduled meeting workflow", () => {
  it("schedules from the Meetings page, finds it by search, hosts it and ends it", () => {
    const title = `Cypress Workflow ${Date.now()}`;

    cy.visit("/meetings");
    cy.getByTestId("meetings-schedule-button").click();
    cy.getByTestId("schedule-title-input").clear().type(title);
    cy.getByTestId("schedule-description-input").type("End-to-end workflow check");
    cy.getByTestId("schedule-duration-minutes").select("45");
    cy.getByTestId("schedule-submit").click();
    cy.getByTestId("scheduled-summary").should("contain", title).and("contain", "1 hr 45 min");
    cy.getByTestId("scheduled-invite-link").invoke("text").should("match", /\/j\/\d{11}$/);
    cy.getByTestId("schedule-done").click();

    cy.getByTestId("meetings-search").type(title);
    cy.getByTestId("upcoming-meeting").should("have.length", 1).and("contain", title);

    cy.getByTestId("upcoming-meeting").find('[data-testid="meeting-start-button"]').click();
    cy.getByTestId("meeting-room").should("be.visible");
    cy.getByTestId("room-title").should("have.text", title);

    cy.getByTestId("toggle-audio").click().should("have.attr", "data-state", "off");
    cy.getByTestId("toggle-audio").click().should("have.attr", "data-state", "on");

    cy.getByTestId("participants-button").click();
    cy.getByTestId("participants-panel").should("contain", "(Host, me)");
    cy.getByTestId("participants-panel").find('button[aria-label="Close participants"]').click();
    cy.getByTestId("participants-panel").should("not.exist");

    cy.getByTestId("more-button").click();
    cy.contains('[role="menuitem"]', "Copy meeting ID").click();
    cy.getByTestId("toast").should("contain", "Meeting ID copied");

    cy.getByTestId("leave-meeting").should("have.text", "End").click();
    cy.getByTestId("end-for-all").click();
    cy.location("pathname").should("eq", "/");

    cy.visit("/meetings?tab=previous");
    cy.getByTestId("recent-meeting").first().should("contain", title).and("contain", "Ended");
  });

  it("cancelling a delete keeps the meeting", () => {
    const title = `Keep Me ${Date.now()}`;
    cy.scheduleMeeting(title).then((meeting) => {
      cy.visitDashboard();
      cy.get(`[data-meeting-code="${meeting.meeting_code}"]`).find('[data-testid="meeting-more-button"]').click();
      cy.getByTestId("delete-meeting").click();
      cy.getByTestId("confirm-dialog").contains("button", "Cancel").click();
      cy.getByTestId("confirm-dialog").should("not.exist");
      cy.get(`[data-meeting-code="${meeting.meeting_code}"]`).should("contain", title);
    });
  });

  it("supports keyboard navigation in the meeting card menu", () => {
    cy.scheduleMeeting(`Keyboard ${Date.now()}`).then((meeting) => {
      cy.visitDashboard();
      cy.get(`[data-meeting-code="${meeting.meeting_code}"]`).find('[data-testid="meeting-more-button"]').click();
      cy.focused().should("have.attr", "role", "menuitem").and("contain", "Copy invitation");
      cy.focused().type("{downArrow}");
      cy.focused().should("contain", "Copy invite link");
      cy.focused().type("{esc}");
      cy.get('[role="menu"]').should("not.exist");
    });
  });
});
