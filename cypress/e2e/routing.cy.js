/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Routing Default Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.login();
    })

    it("directs to correct main pages", () => {
        // dashboard
        cy.visit(`${baseUrl}/dashboard`);
        cy.get("h1").should("contain.text", "Dashboard");
        // my movies
        cy.visit(`${baseUrl}/my-movies`);
        cy.get("h1").should("contain.text", "My Movies");
        // forum
        cy.visit(`${baseUrl}/forum`);
        cy.get("h1").should("contain.text", "Forum");
        // account
        cy.visit(`${baseUrl}/account`);
        cy.get("h1").should("contain.text", "Account");
        // logout
        cy.visit(`${baseUrl}/logout`);
        cy.url().should("eq", `${baseUrl}/`);
    });

    it("redirects from admin page to dashboard if not admin user", () => {
        cy.visit(`${baseUrl}/admin`);
        cy.url().should("eq", `${baseUrl}/dashboard`);
     });

})


describe("Routing Admin User", () => {

    before(() => {
        cy.resetDb();
    })

    it("directs to admin page", () => {
        cy.loginAdmin();
        cy.visit(`${baseUrl}/admin`);
        cy.url().should("eq", `${baseUrl}/admin`);
     });

})
