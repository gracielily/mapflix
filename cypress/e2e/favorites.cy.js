/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Favorites Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.login();
        cy.visit(`${baseUrl}/my-favorites`);
    })

    const checkIfEmpty = () => {
        cy.get(".message-body").should("exist").and("contain.text", "You currently have no favorite locations.");
        cy.get("[data-cy='favorite-point']").should("have.length", 0);
    }

    it("adds and removes point from favorites", () => {
        cy.get("h1").should("contain.text", "Favorite Locations");
        // no favorites listed
        checkIfEmpty();

        // add point to favorites
        cy.visit(`${baseUrl}/dashboard`);
        cy.get("[data-cy='view-movie']").first().click();
        cy.get("[data-cy='movie-point-row']").find("a").first().click();
        cy.get("[data-cy='add-to-favs']").click();

        cy.visit(`${baseUrl}/my-favorites`);
        // point listed in table
        cy.get("[data-cy='favorite-point']").should("have.length", 1);
        cy.get("[data-cy='favorite-point']").first().should("contain.text", "Curracloe Beach")

        // view brings to details
        cy.get("[data-cy='view-fav-point']").click();
        cy.get("h1").should("contain.text", "Point Details");
        cy.visit(`${baseUrl}/my-favorites`);

        // remove from favorites
        cy.get("[data-cy='delete-fav-point']").click();
        checkIfEmpty();

    })
})