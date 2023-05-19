const { baseUrl } = Cypress.config()


const loginUser = (email, password) => {
    cy.visit(`${baseUrl}/login`);
    cy.get("input").first().type(email);
    cy.get("input").last().type(password);
    cy.get("button").first().click();
}
Cypress.Commands.add("login", () => {
    loginUser("jane@doe.com", "Passw0rd?123");
})

Cypress.Commands.add("loginAdmin", () => {
    loginUser("john@doe.com", "S0m3secrEt!");
})

Cypress.Commands.add("resetDb", () => {
    cy.visit(`${baseUrl}/tests-reset-db`);
})
