/// <reference types="Cypress" />

const fillInTheBlanks = (changeOnlyTitle: boolean = false) => {
  if (changeOnlyTitle) {
    cy.get('[data-cy="title"]')
      .wait(500)
      .clear()
      .type("E2E TEST TITLE", { delay: 100 });
  } else {
    cy.get('[data-cy="title"]')
      .wait(500)
      .type("E2E TEST TITLE", { delay: 100 });
    cy.get('[data-cy="hint"]').wait(500).type("E2E TEST HINT", { delay: 50 });
    cy.get('[data-cy="solution"]')
      .wait(500)
      .type("E2E TEST SOLUTION", { delay: 50 });
    cy.get(".codex-editor").wait(500).type("E2E DESCRIPTION", { delay: 50 });
  }
};

describe("Questions gage", () => {
  it("should fetch ds-algo and front-end questions sequentially", () => {
    cy.intercept("GET", "/api/questions?type=ds_algo").as("dsAlgo");
    cy.intercept("GET", "/api/questions?type=front_end").as("frontEnd");

    cy.visit("http://localhost:3000/questions");

    cy.wait("@dsAlgo").then((response) => {
      expect(response.response?.statusCode).to.eq(200);

      response.response?.body.content.forEach(
        (question: QuestionFromDB) => {
          expect(question).to.have.property("type", "ds_algo");
        }
      );
    });

    cy.get('[data-cy="toggle-question-type"]').click();

    cy.wait("@frontEnd").then((response) => {
      expect(response.response?.statusCode).to.eq(200);

      response.response?.body.content.forEach(
        (question: QuestionFromDB) => {
          expect(question).to.have.property("type", "front_end");
        }
      );
    });
  });

  it("should create and delete a question for each type", () => {
    cy.visit("http://localhost:3000/questions");

    fillInTheBlanks(false);

    // Create a ds-algo question
    cy.intercept("POST", "/api/questions").as("createDsAlgoQuestion");
    cy.get('[data-cy="create"]').click();

    cy.wait("@createDsAlgoQuestion").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });

    // Delete the ds-algo question
    cy.intercept("DELETE", "/api/questions").as("deleteDsAlgoQuestion");
    cy.contains("E2E TEST TITLE").parent().next().click();
    cy.wait("@deleteDsAlgoQuestion").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });

    cy.get('[data-cy="toggle-question-type"]').click();

    // Create a front-end question
    cy.intercept("POST", "/api/questions").as("createFrontEndQuestion");
    cy.get('[data-cy="create"]').click();

    cy.wait("@createFrontEndQuestion").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });

    // Delete the front-end question
    cy.intercept("DELETE", "/api/questions").as("deleteFrontEndQuestion");
    cy.contains("E2E TEST TITLE").parent().next().click();
    cy.wait("@deleteFrontEndQuestion").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });
  });

  it("should edit the first selected question", () => {
    cy.visit("http://localhost:3000/questions");
    cy.get('[data-cy="questions-scroll-area"]').wait(3000).first().click();
    fillInTheBlanks(true);

    // Create a front-end question
    cy.intercept("PATCH", "/api/questions").as("editQuestion");
    cy.get('[data-cy="edit"]').click();

    cy.wait("@editQuestion").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });
  });
});
