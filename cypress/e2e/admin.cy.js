/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Admin Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.loginAdmin();
    })

    it("displays application stats and data", () => {
        cy.get("[data-cy='welcome-admin']").should("contain.text", "Welcome back, John");

        // statistics
        cy.get("[data-cy='users-count']").should("contain.text", "2");
        cy.get("[data-cy='shows-count']").should("contain.text", "5");
        cy.get("[data-cy='points-count']").should("contain.text", "7");
        cy.get("[data-cy='posts-count']").should("contain.text", "1");

        // users table
        cy.get("[data-cy='user-row']").should("have.length", 2);
        cy.get("[data-cy='user-row']").first().should("contain.text", "Doe, Jane").
        and("contain.text", "jane@doe.com");

        const btns = ["delete-user", "toggle-admin"]
        btns.forEach((btn) => {
            
        // toggle admin and delete
            cy.get("[data-cy='user-row']").first().find(`[data-cy='${btn}']`).should("exist") 
        // admin user does not have option to toggle their status or delete
            cy.get("[data-cy='user-row']").last().find(`[data-cy='${btn}']`).should("not.exist")
        })
        
        // view account btn is for logged in admin only
        cy.get("[data-cy='user-row']").first().find("[data-cy='view-account']").should("not.exist")
        cy.get("[data-cy='user-row']").last().find("[data-cy='view-account']").should("exist")
        
    });

    it("toogles admin status of user", () => {
        // user is not admin
        cy.get("[data-cy='user-row']").first().find("[data-cy='is-admin']").should("not.exist");
        cy.get("[data-cy='user-row']").first().find("[data-cy='not-admin']").should("exist");
        cy.get("[data-cy='toggle-admin']").should("contain.text", "Enable Admin");
        cy.get("[data-cy='toggle-admin']").click();

        // user now is admin
        cy.get("[data-cy='user-row']").first().find("[data-cy='not-admin']").should("not.exist");
        cy.get("[data-cy='user-row']").first().find("[data-cy='is-admin']").should("exist");
        cy.get("[data-cy='toggle-admin']").should("contain.text", "Disable Admin");
        cy.get("[data-cy='toggle-admin']").click();
        
        // user no longer admin
        cy.get("[data-cy='toggle-admin']").should("contain.text", "Enable Admin");

    });

    it("deletes user", () => {
        cy.get("[data-cy='user-row']").should("have.length", 2);
        cy.get("[data-cy='delete-user']").click();
        cy.get("[data-cy='user-row']").should("have.length", 1);
        cy.get("[data-cy='user-row']").first().should("contain.text", "Doe, John").
        and("contain.text", "john@doe.com");
    });

})
