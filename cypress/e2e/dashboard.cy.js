/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Dashboard Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.login();
    })

    it("displays all movies", () => {
        cy.get("h1").should("contain.text", "Dashboard");
        cy.get("[data-cy='movie-card']").should("have.length", 5);
        // delete option hidden
        cy.get("body").first().should("not.contain.text", "Delete");
    })

    it("filters movies by title", () => {
        cy.get("#searchTerm").type("Brook");
        cy.get("[data-cy='search-movies-btn']").click();
        cy.get("[data-cy='movie-card']").should("have.length", 1);
        cy.get("[data-cy='movie-card']").should("contain.text", "Brooklyn");
    })

    it("displays message when no movies found for search", () => {
        cy.get("#searchTerm").type("invalid");
        cy.get("[data-cy='search-movies-btn']").click();
        cy.get("[data-cy='movie-card']").should("have.length", 0);
        cy.get(".message-body").should("exist").and("contain.text", "No Shows found for search term")
    })

    it("displays all movies when search term empty", () => {
        cy.get("#searchTerm").clear();
        cy.get("[data-cy='search-movies-btn']").click();
        cy.get("[data-cy='movie-card']").should("have.length", 5);
    })

    it("clicking view directs to show details page", () => {
        cy.get("[data-cy='view-movie']").first().click();
        cy.get("h1").should("contain.text", "Saving Private Ryan");
    })


})
