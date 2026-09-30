const presets: [Cypress.ViewportPreset | [number, number], string][] = [
  [[1440, 900], "desktop"],
  [[768, 1024], "tablet"],
  [[390, 844], "mobile"],
];

function viewport(size: Cypress.ViewportPreset | [number, number]) {
  if (Array.isArray(size)) cy.viewport(size[0], size[1]);
  else cy.viewport(size);
}

describe("Responsive layout", () => {
  presets.forEach(([size, label]) => {
    it(`renders the dashboard without horizontal scroll on ${label}`, () => {
      viewport(size);
      cy.visitDashboard();
      cy.document().then((doc) => {
        expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
      });
      cy.getByTestId("new-meeting-button").should("be.visible");
      cy.getByTestId("upcoming-meetings").should("be.visible");
    });
  });

  it("shows the bottom tab bar and bottom-sheet dialogs on mobile", () => {
    cy.viewport(390, 844);
    cy.visitDashboard();
    cy.getByTestId("mobile-tab-bar").should("be.visible");
    cy.getByTestId("join-meeting-button").click();
    cy.getByTestId("join-meeting-modal").should(($dialog) => {
      const rect = $dialog[0].getBoundingClientRect();
      expect(Math.round(rect.bottom)).to.eq(844);
      expect(Math.round(rect.width)).to.eq(390);
    });
  });

  it("hides the tab bar and centres dialogs on desktop", () => {
    cy.viewport(1280, 800);
    cy.visitDashboard();
    cy.getByTestId("mobile-tab-bar").should("not.be.visible");
    cy.getByTestId("join-meeting-button").click();
    cy.getByTestId("join-meeting-modal").should(($dialog) => {
      const rect = $dialog[0].getBoundingClientRect();
      expect(rect.width).to.be.lessThan(500);
      expect(rect.top).to.be.greaterThan(0);
    });
  });

  it("keeps the meeting toolbar usable on a small phone", () => {
    cy.viewport(375, 812);
    cy.startInstantMeeting().then((meeting) => {
      cy.visit(`/j/${meeting.meeting_code}`);
      cy.getByTestId("display-name-input").type("Phone Guest");
      cy.getByTestId("join-submit").click();
      cy.getByTestId("meeting-toolbar").should("be.visible");
      ["toggle-audio", "toggle-video", "participants-button", "more-button", "leave-meeting"].forEach((id) => {
        cy.getByTestId(id).should("be.visible");
      });
      cy.getByTestId("participants-button").click();
      cy.getByTestId("participants-panel").then(($panel) => {
        expect(Math.round($panel[0].getBoundingClientRect().width)).to.eq(375);
      });
    });
  });
});
