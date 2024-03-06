/// <reference types="Cypress" />

describe("Creating a new room", () => {
  it("fails when an interview type is not selected", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="create-room-modal"]').click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('input[name="userName"]').type("Naral");
    cy.get('[data-cy="submit"]').click()
    cy.contains("You need to select an interview type.").should("be.visible");
  });

  it("fails when the room name is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="create-room-modal"]').click();
    cy.get('input[name="userName"]').type("Naral");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });
    cy.get('[data-cy="submit"]').click()
    cy.contains("Room name cannot be empty").should("be.visible");
  });

  it("fails when the username is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="create-room-modal"]').click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });
    cy.get('[data-cy="submit"]').click()
    cy.contains("Name cannot be empty").should("be.visible");
  });

  it("succeeds and navigate to it when necessary fields are filled", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="create-room-modal"]').click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('input[name="userName"]').type("Naral");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });

    // Create room
    cy.intercept("POST", "/api/db").as("createRoom");
    cy.get('[data-cy="submit"]').click()

    // Shouldn't take more than 10 seconds each for creating and navigating to the room
    cy.wait("@createRoom", { responseTimeout: 10000 });
    cy.url({ timeout: 10000 }).should("include", "/code/ds-algo/");
  });

  // TODO: creating a front-end room
});
