/// <reference types="Cypress" />

describe("Joining a new room by its id", () => {
  it("fails when the room id is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="join-room-by-id-modal"]').click()
    cy.get('[data-cy="randomizer-dice"]').click()
    cy.get('[data-cy="submit"]').click()
    cy.contains("Room ID cannot be empty.").should("be.visible");
  });

  it("fails when the user name is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="join-room-by-id-modal"]').click()
    cy.get('input[name="roomId"]').type(Cypress.env('default_room_id'));
    cy.get('[data-cy="submit"]').click()
    cy.contains("Required").should("be.visible");
  });

  it("fails when the room doesn't exist", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="join-room-by-id-modal"]').click();
    cy.get('input[name="roomId"]').type(Cypress.env("non_existing_room"));
    cy.get('[data-cy="randomizer-dice"]').click();

    // Attempt to join the room
    cy.intercept(
      "GET",
      `/api/db?roomId=${Cypress.env("non_existing_room")}`
    ).as("joinRoom");
    cy.get('[data-cy="submit"]').click();

    // API response should be 400
    cy.wait("@joinRoom").then((response) =>
      expect(response.response?.statusCode).to.eq(400)
    );
  });

  it("succeeds and navigate to it when necessary fields are filled", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="join-room-by-id-modal"]').click();
    cy.get('input[name="roomId"]').type(Cypress.env("default_room_id"));
    cy.get('[data-cy="randomizer-dice"]').click();

    // Create room
    cy.intercept("GET", `/api/db?roomId=${Cypress.env("default_room_id")}`).as(
      "joinRoom"
    );
    cy.get('[data-cy="submit"]').click();

    // TODO: Check if url is correct based on returned interviewtype and user name
    // Response should be 200
    cy.wait("@joinRoom", { responseTimeout: 10000 }).then((response) => {
      expect([200, 304]).to.include(response.response?.statusCode);
      cy.url({ timeout: 10000 }).should("match", /\/code\/(ds-algo|front-end)/);
    });
  });
});
