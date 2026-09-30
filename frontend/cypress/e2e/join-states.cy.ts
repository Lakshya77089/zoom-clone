describe("Join meeting states", () => {
  const code = "12345678901";

  beforeEach(() => {
    cy.visitDashboard();
    cy.getByTestId("join-meeting-button").click();
    cy.getByTestId("meeting-id-input").type(code);
    cy.getByTestId("display-name-input").clear().type("Casey Tester");
  });

  it("shows a loading state while joining", () => {
    cy.intercept("POST", `/api/meetings/${code}/join`, { statusCode: 404, body: { detail: "Invalid meeting ID. Please check and try again." }, delay: 800 }).as("join");
    cy.getByTestId("join-submit").click();
    cy.getByTestId("join-submit").should("be.disabled").and("contain", "Joining...").and("have.attr", "aria-busy", "true");
    cy.wait("@join");
    cy.getByTestId("join-submit").should("not.be.disabled").and("contain", "Join");
  });

  it("shows the ended message for a meeting that has ended", () => {
    cy.intercept("POST", `/api/meetings/${code}/join`, { statusCode: 410, body: { detail: "This meeting has ended." } });
    cy.getByTestId("join-submit").click();
    cy.getByTestId("field-error").should("have.text", "This meeting has ended.");
  });

  it("shows a form error when the server fails", () => {
    cy.intercept("POST", `/api/meetings/${code}/join`, { statusCode: 500, body: { detail: "Service temporarily unavailable." } });
    cy.getByTestId("join-submit").click();
    cy.getByTestId("form-error").should("contain", "Service temporarily unavailable.");
    cy.getByTestId("join-meeting-modal").should("be.visible");
  });

  it("shows a connection error when the network is down", () => {
    cy.intercept("POST", `/api/meetings/${code}/join`, { forceNetworkError: true });
    cy.getByTestId("join-submit").click();
    cy.getByTestId("form-error").should("contain", "Unable to reach the server");
  });

  it("clears a field error as soon as the user edits the field", () => {
    cy.getByTestId("display-name-input").clear();
    cy.getByTestId("join-submit").click();
    cy.getByTestId("field-error").should("have.text", "Please enter your name.");
    cy.getByTestId("display-name-input").type("A");
    cy.getByTestId("field-error").should("not.exist");
  });
});

describe("Dashboard states", () => {
  it("shows empty states when there are no meetings", () => {
    cy.intercept("GET", "/api/meetings/upcoming", []).as("upcoming");
    cy.intercept("GET", "/api/meetings/recent", []).as("recent");
    cy.visit("/");
    cy.wait(["@upcoming", "@recent"]);
    cy.getByTestId("upcoming-empty").should("contain", "No meetings scheduled.");
    cy.getByTestId("recent-empty").should("contain", "No recent meetings");
    cy.getByTestId("schedule-meeting-button").click();
    cy.getByTestId("schedule-meeting-modal").should("be.visible");
  });

  it("shows an error banner when meetings fail to load", () => {
    cy.intercept("GET", "/api/meetings/upcoming", { statusCode: 500, body: { detail: "Database is unavailable." } });
    cy.visit("/");
    cy.getByTestId("form-error").should("contain", "Database is unavailable.");
  });

  it("shows loading skeletons while meetings load", () => {
    cy.intercept("GET", "/api/meetings/upcoming", (request) => {
      request.on("response", (response) => {
        response.setDelay(1000);
      });
    });
    cy.visit("/");
    cy.get('[aria-label="Loading meetings"]').should("exist");
    cy.get('[aria-label="Loading meetings"]').should("not.exist");
  });

  it("jumps from an empty day to the next day with meetings", () => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    start.setHours(10, 0, 0, 0);
    const meeting = {
      id: 9001,
      meeting_code: "12312312312",
      title: "Stubbed Planning Session",
      description: null,
      meeting_type: "scheduled",
      status: "scheduled",
      scheduled_start: start.toISOString(),
      scheduled_end: new Date(start.getTime() + 30 * 60_000).toISOString(),
      duration_minutes: 30,
      started_at: null,
      ended_at: null,
      created_at: new Date().toISOString(),
      participant_count: 0,
      host: { id: 1, name: "Alex Johnson", email: "alex.johnson@example.com", avatar_color: "#F26D21" },
      invite_link: "http://localhost/j/12312312312",
    };
    cy.intercept("GET", "/api/meetings/upcoming", [meeting]);
    cy.visit("/");
    cy.getByTestId("upcoming-empty").should("contain", "No meetings scheduled.");
    cy.getByTestId("calendar-jump-next").should("contain", "Next meeting").click();
    cy.getByTestId("upcoming-meeting").should("have.length", 1).and("contain", "Stubbed Planning Session");
    cy.getByTestId("calendar-today").should("have.attr", "aria-pressed", "false").click();
    cy.getByTestId("upcoming-empty").should("exist");
  });
});
