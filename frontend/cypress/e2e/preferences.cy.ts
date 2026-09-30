describe("Meeting preferences", () => {
  it("persists toggles across reloads", () => {
    cy.visit("/settings");
    cy.get("#pref-join-muted").should("have.attr", "aria-checked", "false").click();
    cy.get("#pref-join-muted").should("have.attr", "aria-checked", "true");

    cy.reload();
    cy.get("#pref-join-muted").should("have.attr", "aria-checked", "true");
  });

  it("applies join preferences to the join dialog and pre-join screen", () => {
    cy.visit("/settings");
    cy.get("#pref-join-muted").click();
    cy.get("#pref-join-video-off").click();

    cy.visitDashboard();
    cy.getByTestId("join-meeting-button").click();
    cy.get("#join-audio-off").should("be.checked");
    cy.get("#join-video-off").should("be.checked");
    cy.get("body").type("{esc}");

    cy.startInstantMeeting().then((meeting) => {
      cy.visit(`/j/${meeting.meeting_code}`);
      cy.getByTestId("prejoin-toggle-audio").should("have.attr", "aria-label", "Unmute");
      cy.getByTestId("prejoin-toggle-video").should("have.attr", "aria-label", "Start Video");
      cy.getByTestId("prejoin-toggle-audio").click();
      cy.getByTestId("prejoin-toggle-audio").should("have.attr", "aria-label", "Mute");
    });
  });

  it("hides invite details on start when the preference is off", () => {
    cy.visit("/settings");
    cy.get("#pref-show-invite").should("have.attr", "aria-checked", "true").click();

    cy.visitDashboard();
    cy.getByTestId("new-meeting-button").click();
    cy.getByTestId("meeting-room").should("be.visible");
    cy.getByTestId("meeting-info").should("not.exist");
    cy.getByTestId("meeting-info-button").click();
    cy.getByTestId("meeting-info").should("be.visible");
  });
});
