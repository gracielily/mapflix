/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Account Details Behaviour", () => {

    beforeEach(() => {
        cy.resetDb();
        cy.login();
        cy.visit(`${baseUrl}/account`);
    })

    const checkUserDetails = (firstName, lastName, email) => {
        cy.get("[data-cy='first-name-input']").should("have.value", firstName);
        cy.get("[data-cy='last-name-input']").should("have.value", lastName);
        cy.get("[data-cy='email-input']").should("have.value", email);
    }

    const populateDetailsForm = (firstName, lastName, email) => {
        cy.get("[data-cy='first-name-input']").clear().type(firstName);
        cy.get("[data-cy='last-name-input']").clear().type(lastName);
        cy.get("[data-cy='email-input']").clear().type(email);
        cy.get("[data-cy='save-details-btn']").click();
    }

    it("displays account details", () => {
       checkUserDetails("Jane", "Doe", "jane@doe.com");
       // password field is hidden
       cy.get("[data-cy='password-input']").should("not.exist");
    });

    it("displays error when user cannot be edited", () => {
        populateDetailsForm("Janey", "Doee", "invalid");
        // displays error message
        cy.get(".message-body").should("exist").and("contain.text", "must be a valid email");
    })

    it("edits and updates user", () => {
        populateDetailsForm("Janey", "Doee", "jane@newemail.com");
        // point form is pre-populated with values entered
        checkUserDetails("Janey", "Doee", "jane@newemail.com");
    })

    it("deletes account redirects to home page", () => {
        cy.get("[data-cy='delete-account']").click();
        cy.url().should("equal", `${baseUrl}/`);
        // visiting dashboard brings to login
        cy.visit(`${baseUrl}/dashboard`);
        cy.url().should("equal", `${baseUrl}/login`)
    })

})
