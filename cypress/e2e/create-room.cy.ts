/// <reference types="Cypress" />

describe("Creating a new room", () => {
  it("fails when an interview type is not selected", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Create a Room").click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('input[name="userName"]').type("Naral");
    cy.contains("Proceed").click();
    cy.contains("You need to select an interview type.").should("be.visible");
  });

  it("fails when the room name is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Create a Room").click();
    cy.get('input[name="userName"]').type("Naral");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });
    cy.contains("Proceed").click();
    cy.contains("Room name cannot be empty").should("be.visible");
  });

  it("fails when the username is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Create a Room").click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });
    cy.contains("Proceed").click();
    cy.contains("Name cannot be empty").should("be.visible");
  });

  it("succeeds and navigate to it when necessary fields are filled", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Create a Room").click();
    cy.get('input[name="roomName"]').type("E2E Test Room");
    cy.get('input[name="userName"]').type("Naral");
    cy.get('[value="ds_algo"]').click({ multiple: true, force: true });

    // Create room
    cy.intercept("POST", "/api/db").as("createRoom");
    cy.contains("Proceed").click();
    cy.wait("@createRoom", { timeout: 30000 }); // shouldn't take more than 10 seconds
    cy.url().should("include", "/code/ds-algo/");
  });

  // TODO: creating a front-end room
});
