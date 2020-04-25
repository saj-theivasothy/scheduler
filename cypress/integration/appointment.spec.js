describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]").first().click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click();

    cy.contains("SAVING").should("exist");
    cy.contains("SAVING").should("not.exist");

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
    cy.get("[data-testid=day").first().contains("no spots remaining");
  });

  it("should edit an interview", () => {
    cy.get("[alt='Edit']").first().click({ force: true });

    cy.get("[data-testid=student-name-input]").clear().type("David Smith");

    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains("SAVING").should("exist");
    cy.contains("SAVING").should("not.exist");

    cy.contains(".appointment__card--show", "David Smith");
    cy.contains(".appointment__card--show", "Tori Malcolm");
    cy.get("[data-testid=day").first().contains("1 spot remaining");
  });

  it("should cancel an interview", () => {
    cy.get("[alt='Delete']").first().click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("DELETING").should("exist");
    cy.contains("DELETING").should("not.exist");

    cy.get("[data-testid=day").first().contains("2 spots remaining");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
