/// <reference types="cypress" />

const {baseUrl} = Cypress.config()

describe("Show Details Behaviour", () => {

  before(() => {
    cy.resetDb();
})

  beforeEach(() => {
    cy.login();
  })

  it("displays movie details and lists points", () => {
    cy.get("[data-cy='view-movie']").first().click();
    // movie details
    cy.get("h1").should("contain.text", "Saving Private Ryan");
    cy.get("[data-cy='movie-tagline']").should("contain.text", "The mission is a man");
    cy.get("[data-cy='movie-runtime']").should("contain.text", "169 minutes");
    // movie points
    cy.get("[data-cy='movie-point-row']").should("have.length", 1);
    cy.get("[data-cy='movie-point-row']").first().should("contain.text", "Curracloe Beach");
    cy.get("[data-cy='movie-point-row']").first().find("[data-cy='lock-icon']").should("have.class", "fa-lock-open")
    // should display config form
    cy.get("[data-cy='movie-config-panel']").should("exist");
    // movie form is pre-populated
    cy.get("[data-cy='show-name-input']").should("have.value", "Saving Private Ryan");
    cy.get("[data-cy='imdbid-input']").should("have.value", "tt0120815");
  })

  it("can view point", () => {
    cy.get("[data-cy='view-movie']").first().click();
    cy.get("[data-cy='movie-point-row']").find("a").first().click();
    // should redirect to point details page
    cy.get("[data-cy='point-name']").should("contain.text", "Curracloe Beach");
  });


  it("hides info when movie does not belong to user", () => {
    cy.get("[data-cy='view-movie']").eq(4).click();
    cy.get("h1").should("contain.text", "Breaveheart");
    // config panel hidden
    cy.get("[data-cy='movie-config-panel']").should("not.exist");
    // hides lock icon
    cy.get("[data-cy='movie-point-row']").first().find("[data-cy='lock-icon']").should("not.exist");
    // delete btn hidden
    cy.get("[data-cy='movie-point-row']").first().find("a").should("have.length", 1);
  })

  it("can delete point", () => {
    cy.get("[data-cy='view-movie']").first().click();
    // deletes point
    cy.get("[data-cy='movie-point-row']").should("have.length", 1);
    cy.get("[data-cy='movie-point-row']").find("a").last().click();
    cy.get("[data-cy='movie-point-row']").should("have.length", 0);
    cy.get("[data-cy='message-bar']").should("exist").and("contain.text", "No Points");
  })

  it("updates movie details", () => {
    cy.get("[data-cy='view-movie']").first().click();
    cy.get("[data-cy='show-name-input']").clear().type("New Name");
    cy.get(".is-fullwidth").first().click();
    // name is changed
    cy.get("h1").should("contain.text", "New Name");
    cy.get("[data-cy='show-name-input']").should("have.value", "New Name");
  })

  it("displays error message when movie cannot be edited", () => {
    cy.get("[data-cy='view-movie']").first().click();
    // submit form with invalid imdbID
    cy.get("[data-cy='show-name-input']").clear().type("New Name");
    cy.get("[data-cy='imdbid-input']").clear().type("invalidId");
    cy.get(".is-fullwidth").first().click();
    cy.get(".message-body").should("exist").and("contain.text", "fails to match the required pattern")
    // movie form is pre-populated with values entered
    cy.get("[data-cy='show-name-input']").should("have.value", "New Name");
    cy.get("[data-cy='imdbid-input']").should("have.value", "invalidId");
  })

  it("adds a new point", () => {
    cy.get("[data-cy='movie-point-row']").should("have.length", 0);
    cy.get("[data-cy='view-movie']").first().click();
    cy.get("[data-cy='point-name-input']").type("New Point");
    cy.get("[data-cy='point-latitude-input']").type("53.533");
    cy.get("[data-cy='point-longitude-input']").type("-3.11");
    cy.get("[data-cy='point-desc-input']").type("Description");
    cy.get(".is-fullwidth").eq(2).click();
    // point populated in table
    cy.get("[data-cy='movie-point-row']").should("have.length", 1);
    cy.get("[data-cy='movie-point-row']").first().should("contain.text", "New Point");
    // is private by default
    cy.get("[data-cy='movie-point-row']").first().find("[data-cy='lock-icon']").should("have.class", "fa-lock")
  })


  it("deletes all points", () => {
    cy.get("[data-cy='view-movie']").first().click();
    cy.get("[data-cy='delete-all-points']").click();
    // confirm delete
    cy.on("window:confirm", () => true)
    cy.get("[data-cy='message-bar']").should("exist").and("contain.text", "No Points");
    cy.get("[data-cy='movie-point-row']").should("have.length", 0);
  })

  it("deletes show and redirects to my movies", () => {
    cy.visit(`${baseUrl}/my-movies`);
    cy.get("[data-cy='view-movie']").should("have.length", 4);
    cy.get("[data-cy='view-movie']").first().click();
    cy.get("[data-cy='delete-show']").click();
    cy.get("h1").should("contain.text", "My Movies");
    cy.get("[data-cy='view-movie']").should("have.length", 3);
  })

})
