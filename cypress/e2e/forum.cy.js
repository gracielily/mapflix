/// <reference types="cypress" />

const { baseUrl } = Cypress.config()

describe("Forum Behaviour", () => {

    before(() => {
        cy.resetDb();
    })

    beforeEach(() => {
        cy.login();
        cy.visit(`${baseUrl}/forum`);
    })

    it("displays posts list", () => {
        cy.get("h1").should("contain.text", "Forum");
        // forum posts listed
        cy.get("[data-cy='post-row']").should("have.length", 1);
        // post details
        cy.get("[data-cy='post-title']").should("contain.text", "Post 1");
        cy.get("[data-cy='post-user']").should("contain.text", "Jane Doe");
        cy.get("[data-cy='post-comment-count']").should("contain.text", "1");
    })


    it("displays post details", () => {
        cy.get("[data-cy='post-title']").click();
        cy.get("h1").should("contain.text", "Discussion");
        // post overview
        cy.get("[data-cy='post-overview-name']").should("contain.text", "Jane Doe");
        cy.get("[data-cy='post-overview-title']").should("contain.text", "Post 1");
        cy.get("[data-cy='post-overview-body']").should("contain.text", "This is a post");
        // forum comments listed
        cy.get("[data-cy='comment-row']").should("have.length", 1);
        cy.get("[data-cy='comment-body']").should("contain.text", "John Doe")
        .and("contain.text", "This is a comment");
        // option to delete comment not visible
        cy.get("[data-cy='delete-comment']").should("not.exist");
        // add comment form visible
        cy.get("#postForm").should("exist");
    })


    it("add and delete comment", () => {
        cy.get("[data-cy='post-title']").click();
        cy.get("[data-cy='comment-body-input']").type("Another comment");
        cy.get("[data-cy='add-comment']").click();
        // comment added to list
        cy.get("[data-cy='comment-row']").should("have.length", 2);
        cy.get("[data-cy='comment-body']").last().should("contain.text", "Jane Doe")
        .and("contain.text", "Another comment");
        // delete comment
        cy.get("[data-cy='comment-row']").last().find("[data-cy='delete-comment']").should("exist").click();
        cy.get("[data-cy='comment-row']").should("have.length", 1);
    })


    it("edits post", () => {
        cy.get("[data-cy='post-title']").click();
        cy.get("[data-cy='post-title-input']").clear().type("Edited Title");
        cy.get("[data-cy='post-body-input']").clear().type("Edited Body");
        cy.get("[data-cy='submit-post']").click();
        cy.get("[data-cy='post-overview-title']").should("contain.text", "Edited Title");
        cy.get("[data-cy='post-overview-body']").should("contain.text", "Edited Body");
    })

    
    it("delete post redirects to forum", () => {
        cy.get("[data-cy='post-title']").click();
        cy.get("[data-cy='delete-post']").click();
        cy.get("h1").should("contain.text", "Forum");
        cy.get(".message-body").should("exist").and("contain.text", "No posts yet, you can create one by using the form below.");
        cy.get("[data-cy='post-row']").should("have.length", 0);
    })


    it("dsiplays error when post cannot be created", () => {
        cy.get("[data-cy='submit-post']").click();
        // post not created
        cy.get(".message-body").should("exist").and("contain.text", "No posts yet, you can create one by using the form below.");
        cy.get("[data-cy='post-row']").should("have.length", 0);
    })


    it("creates post", () => {
        cy.get("[data-cy='post-title-input']").type("Another Post");
        cy.get("[data-cy='post-body-input']").type("Another Comment");
        cy.get("[data-cy='submit-post']").click();
        // post added to list
        cy.get("[data-cy='post-row']").should("have.length", 1);
    })
})