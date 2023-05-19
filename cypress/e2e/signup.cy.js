/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Signup Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.visit(`${baseUrl}/signup`);
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

    it("redirects to login page", () => {
        cy.get("[data-cy='login-redirect']").click();
        cy.url().should("eq", `${baseUrl}/login`);
    });

    it("signs user up to application", () => {
        cy.get("[data-cy='first-name-input']").type("Mary");
        cy.get("[data-cy='last-name-input']").type("Connor");
        cy.get("[data-cy='email-input']").type("maryconnor@gmail.com");
        cy.get("[data-cy='password-input']").type("Sup3rsecure!");
        cy.get(".is-fullwidth").first().click();

        // user prompted to log in
        cy.url().should("eq", `${baseUrl}/login`);
        cy.get("[data-cy='email-input']").type("maryconnor@gmail.com");
        cy.get("[data-cy='password-input']").type("Sup3rsecure!");
        cy.get(".is-fullwidth").first().click();

        // user logged in
        cy.url().should("eq", `${baseUrl}/dashboard`);
    });

})
