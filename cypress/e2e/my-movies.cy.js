/// <reference types="cypress" />

const {baseUrl} = Cypress.config()

describe("My Movies Behaviour", () => {

  before(() => {
    cy.resetDb();
})

    beforeEach(() => {
        cy.login();
        cy.visit(`${baseUrl}/my-movies`);
    })
  
    it("displays movies belonging to user and displays delete option", () => {
      cy.get("h1").should("contain.text", "My Movies");  
      cy.get("[data-cy='movie-card']").should("have.length", 4);
      // has delete option
      cy.get("[data-cy='movie-card']").first().should("contain.text", "Delete");
    })

    it("displays error message when movie cannot be created", () => {
        // submit form with invalid imdbID
        cy.get("[data-cy='show-name-input']").type("Frozen");
        cy.get("[data-cy='imdbid-input']").type("invalidId");
        cy.get(".is-fullwidth").click();
        cy.get(".message-body").should("exist").and("contain.text", "fails to match the required pattern")
        
      })
  
    it("can add new movie", () => {
      cy.get("[data-cy='show-name-input']").type("Frozen");
      cy.get("[data-cy='imdbid-input']").type("tt89908");
      cy.get(".is-fullwidth").click();

      cy.get("[data-cy='movie-card']").should("have.length", 5);
      cy.get("[data-cy='movie-card']").last().should("contain.text", "Frozen");
    })

    it("clicking view directs to show details page", () => {
      cy.get("[data-cy='view-movie']").first().click();
      cy.get("h1").should("contain.text", "Saving Private Ryan");
    })
  
    it("can delete movie", () => {
      cy.get("[data-cy='movie-card']").should("have.length", 5);
      cy.get("[data-cy='movie-card']").last().should("contain.text", "Frozen");
      cy.get("[data-cy='delete-movie']").last().click();
      cy.get("[data-cy='movie-card']").should("have.length", 4);
      cy.get("[data-cy='movie-card']").last().should("not.contain.text", "Frozen");
    })

    it("can delete all movies", () => {
      cy.get("[data-cy='movie-card']").should("have.length", 4);
      cy.get("[data-cy='delete-all-shows']").click();
      cy.on("window:confirm", () => true)
      cy.get("[data-cy='movie-card']").should("have.length", 0);
      cy.get(".message-body").should("exist").and("contain.text", "You currently have no movies")
      })
  
  })
  