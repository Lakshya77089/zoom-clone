describe("App navigation", () => {
  it("moves between Home, Meetings and Settings from the side rail", () => {
    cy.visitDashboard();
    cy.get('nav[aria-label="Main"]').filter(":visible").as("rail");

    cy.get("@rail").contains("a", "Meetings").click();
    cy.location("pathname").should("eq", "/meetings");
    cy.get("@rail").contains("a", "Meetings").should("have.attr", "aria-current", "page");
    cy.contains("h1", "Meetings").should("be.visible");

    cy.get("@rail").contains("a", "Settings").click();
    cy.location("pathname").should("eq", "/settings");
    cy.contains("h1", "Settings").should("be.visible");

    cy.get("@rail").contains("a", "Home").click();
    cy.location("pathname").should("eq", "/");
    cy.getByTestId("welcome-heading").should("be.visible");
  });

  it("switches meeting tabs and keeps the tab in the URL", () => {
    cy.visit("/meetings");
    cy.getByTestId("tab-upcoming").should("have.attr", "aria-selected", "true");
    cy.getByTestId("tab-previous").click();
    cy.location("search").should("eq", "?tab=previous");
    cy.getByTestId("tab-previous").should("have.attr", "aria-selected", "true");
    cy.getByTestId("recent-list").should("exist");

    cy.reload();
    cy.getByTestId("tab-previous").should("have.attr", "aria-selected", "true");
  });

  it("focuses header search with Ctrl+K", () => {
    cy.visitDashboard();
    cy.get("body").type("{ctrl}k");
    cy.focused().should("have.attr", "data-testid", "header-search");
  });

  it("closes the profile menu with Escape and on outside click", () => {
    cy.visitDashboard();
    cy.getByTestId("profile-button").click();
    cy.getByTestId("profile-menu").should("be.visible").and("contain", "@");
    cy.get("body").type("{esc}");
    cy.getByTestId("profile-menu").should("not.exist");

    cy.getByTestId("profile-button").click();
    cy.getByTestId("welcome-heading").click();
    cy.getByTestId("profile-menu").should("not.exist");
  });

  it("closes dialogs with Escape and the close button", () => {
    cy.visitDashboard();
    cy.getByTestId("join-meeting-button").click();
    cy.getByTestId("join-meeting-modal").should("be.visible");
    cy.get("body").type("{esc}");
    cy.getByTestId("join-meeting-modal").should("not.exist");

    cy.getByTestId("schedule-meeting-button").click();
    cy.getByTestId("schedule-meeting-modal").find('button[aria-label="Close"]').click();
    cy.getByTestId("schedule-meeting-modal").should("not.exist");
  });
});
