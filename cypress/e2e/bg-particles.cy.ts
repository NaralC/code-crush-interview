/// <reference types="Cypress" />

describe("Background Particles", () => {
  it("localStorage persists after reload", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Toggle BG Particles").click();

    cy.window().then((window: Cypress.AUTWindow) => {
      cy.log(window.localStorage.getItem("local-settings-storage") ?? "");
    });

    cy.reload();

    cy.window().then((window: Cypress.AUTWindow) => {
      expect(
        JSON.parse(window.localStorage.getItem("local-settings-storage") ?? "")
      ).to.deep.include({ state: { particleBgVisible: false } });
    });
  });
});
