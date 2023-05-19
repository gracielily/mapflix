/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Login Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.visit(`${baseUrl}/login`);
    })

    it("displays error when invalid credentials", () => {
        cy.get("[data-cy='email-input'").type("invalid-email");
        cy.get("[data-cy='password-input'").type("invalid-password");
        cy.get(".is-fullwidth").first().click();
        cy.get(".message-body").should("contain.text", "fails to match the required pattern");
        // form is pre-populated with submitted values
        cy.get("[data-cy='email-input'").should("have.value", "invalid-email");
        cy.get("[data-cy='password-input'").should("have.value", "invalid-password");
    });

    it("redirects to signup page", () => {
        cy.get("[data-cy='signup-redirect']").click();
        cy.url().should("eq", `${baseUrl}/signup`);

    });

    it("logs user in to application", () => {
        cy.get("[data-cy='email-input']").type("jane@doe.com");
        cy.get("[data-cy='password-input']").type("Passw0rd?123");
        cy.get(".is-fullwidth").first().click();
        cy.url().should("eq", `${baseUrl}/dashboard`);
    });

})
