/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Point Details Behaviour", () => {

    before(() => {
        cy.resetDb(); 
    })

    beforeEach(() => {
        cy.login();
        cy.get("[data-cy='view-movie']").first().click();
        cy.get("[data-cy='movie-point-row']").find("a").first().click();
    })


    it("displays point details to owner", () => {
        cy.get("[data-cy='point-name']").should("contain.text", "Curracloe Beach");
        cy.get("[data-cy='point-visibility']").should("exist");
        // lat,lng is rounded
        cy.get("[data-cy='location']").should("contain.text", "52.39, -6.36");
        cy.get("[data-cy='share-box']").should("exist");
        // prompt user to add to favorites
        cy.get("[data-cy='add-to-favs']").should("exist");
        // images and image options listed
        cy.get("[data-cy='point-image']").should("have.length", 3);
        cy.get("[data-cy='delete-image']").should("have.length", 3);
        // rating form visible
        cy.get("#reviewForm").should("exist");
        // configuration panel visible
        cy.get("[data-cy='point-config-panel']").should("exist");
        // form pre-populated
        cy.get("[data-cy='point-name-input']").should("have.value", "Curracloe Beach");
        cy.get("[data-cy='point-latitude-input']").should("have.value", "52.38877");;
        cy.get("[data-cy='point-longitude-input']").should("have.value", "-6.361969");;
        cy.get("[data-cy='point-desc-input']").should("have.value", "This beach was famously used in the filming of the D-Day landng scenes of the 1997 film.");
    });

    it("adds and removes point from favorites", () => {
        cy.get("[data-cy='add-to-favs']").click();
        // add button replaced with remove
        cy.get("[data-cy='add-to-favs']").should("not.exist");
        cy.get("[data-cy='remove-from-favs']").should("exist");
        
        cy.get("[data-cy='remove-from-favs']").click();
         // remove button replaced with add
         cy.get("[data-cy='add-to-favs']").should("exist");
         cy.get("[data-cy='remove-from-favs']").should("not.exist");
    })

    it("displays error message when point cannot be edited", () => {
        cy.get("[data-cy='point-name-input']").clear();
        cy.get("[data-cy='point-latitude-input']").clear().type("42.222");
        cy.get("[data-cy='point-desc-input']").clear().type("Invalid Point");
        cy.get("[data-cy='submit-point']").click();
        // displays error message
        cy.get(".message-body").should("exist").and("contain.text", "not allowed to be empty");
        // point form is pre-populated with values entered
        cy.get("[data-cy='point-name-input']").should("have.value", "");
        cy.get("[data-cy='point-latitude-input']").should("have.value", "42.222");
        cy.get("[data-cy='point-desc-input']").should("have.value", "Invalid Point");
    })

    it("edits point", () => {
        cy.get("[data-cy='point-name-input']").clear().type("New Name");
        cy.get("[data-cy='point-latitude-input']").clear().type("42.22222");
        cy.get("[data-cy='point-desc-input']").clear().type("Updated Point");
        cy.get("[data-cy='submit-point']").click();
        cy.get("[data-cy='point-name']").should("contain.text", "New Name");
        cy.get("[data-cy='location']").should("contain.text", "42.22, -6.36");
    })


    it("toggle visibility of point", () => {
        // is public point
        cy.get("[data-cy='visibility-icon']").should("have.class", "fa-lock-open");
        cy.get("[data-cy='toggle-visibility']").should("contain.text", "Make Private").click({force: true});
        
        // is now private
        cy.get("[data-cy='visibility-icon']").should("have.class", "fa-lock");

        // no points listed under movie title on dashboard
        cy.visit(`${baseUrl}/dashboard`);
        cy.get("[data-cy='locations-count']").first().should("have.text", "0")

        cy.get("[data-cy='view-movie']").first().click();
        cy.get("[data-cy='movie-point-row']").find("a").first().click();

        // is public again
        cy.get("[data-cy='toggle-visibility']").should("contain.text", "Make Public").click({force: true});
        cy.get("[data-cy='visibility-icon']").should("have.class", "fa-lock-open");

        // 1 point listed under movie title on dashboard
        cy.visit(`${baseUrl}/dashboard`);
        cy.get("[data-cy='locations-count']").first().should("have.text", "1")
    })

    it("displays error message when rating not added", () => {
        cy.get("[data-cy='submit-rating']").click();
        cy.get(".message-body").should("exist").and("contain.text", "must be a number");
        // review not added
        cy.get("[data-cy='point-review']").should("not.exist")
    })


    it("adds review and updates rating", () => {
        // populates rating input when star is clicked
        cy.get(".jq-star").last().click();
        cy.get("[data-cy='rating-input']").should("have.value", "5");

        cy.get("[data-cy='review-title-input']").type("Fantastic");
        cy.get("[data-cy='review-comment-input']").type("Highly recommend visiting");
        cy.get("[data-cy='submit-rating']").click();

        // rating visible on page
        cy.get("[data-cy='point-review']").should("have.length", 1)
        // 5 stars
        cy.get("[data-cy='point-review']").first().find(".fa-star").should("have.length", 5)
        cy.get("[data-cy='point-review']").first().find("small").should("contain.text", "Jane Doe")
        cy.get(".review-comment").should("contain.text", "Fantastic - Highly recommend visiting")

        // rating avg on point details
        cy.get("[data-cy='rating-overview']").find(".fa-star").should("have.length", 5);

        // displays message and hides add rating form
        cy.get("[data-cy='rating-input']").should("not.exist");
        cy.get(".is-info").should("contain.text", "You have already left a rating, thanks!");
    })


    it("deletes point and redirects to show", () => {
        cy.get("[data-cy='delete-point']").click();
        // deletes point
        cy.get("h1").should("contain.text", "Saving Private Ryan");
        // displays no points message 
        cy.get("[data-cy='movie-point-row']").should("have.length", 0);
        cy.get("[data-cy='message-bar']").should("exist").and("contain.text", "No Points");
    })

})

describe("Point Details - Does not belong to User", () => {

    before(() => {
        cy.resetDb(); 
    })

    beforeEach(() => {
        cy.login();
        cy.get("[data-cy='view-movie']").last().click();
        cy.get("[data-cy='movie-point-row']").find("a").first().click();
    })


    it("hides point details to non owner", () => {
        cy.get("[data-cy='point-name']").should("contain.text", "Bective Abbey");
        // visibility is hidden
        cy.get("[data-cy='point-visibility']").should("not.exist");
        cy.get("[data-cy='add-to-favs']").should("exist");
        // rating form visible
        cy.get("#reviewForm").should("exist");
        // configuration panel hidden
        cy.get("[data-cy='point-config-panel']").should("not.exist");
    });

})
