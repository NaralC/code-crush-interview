/// <reference types="Cypress" />

describe("Joining a new room by its id", () => {
  it("fails when a room is not selected", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="browse-room-modal"]').click();
    cy.get('[data-cy="randomizer-dice"]').click();
    cy.get('[data-cy="submit"]').click();
    cy.contains("Select a room first").should("be.visible");
  });

  // TODO: This doesn't account for when there's no rooms to join
  it("fails when user name is empty", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="browse-room-modal"]').click();
    cy.get('[data-cy="room-scroll-area"]').first().click();
    cy.get('[data-cy="submit"]').click();
    cy.contains("Required").should("be.visible");
  });

  it("succeeds and navigate to it when necessary fields are filled", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="browse-room-modal"]').click();
    cy.get('[data-cy="room-scroll-area"]').first().click();
    cy.get('[data-cy="randomizer-dice"]').click();

    // Join room
    cy.intercept("GET", `/api/db?roomId=[\s\S]+`).as("joinRoom");
    cy.get('[data-cy="submit"]').click();

    // TODO: Check if url is correct based on returned interviewtype and user name
    // TODO: Check for response status code on a GET request to /api/db (but this is difficult since we're just clicking whatever's first in the scrollarea)
    cy.url({ timeout: 10000 }).should("match", /\/code\/(ds-algo|front-end)/);
  });
});
