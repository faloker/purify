Cypress.Commands.add('login', (username = 'test', password = 'testtest') => {
  cy.visit('http://localhost:8080/#/welcome');
  cy.get('#tab-login').click();

  cy.get('#username').type(username);
  cy.get('#password').type(password);

  cy.contains('button', 'Sign In').click();
});

Cypress.Commands.add('register', (username, email, password) => {
  cy.visit('http://localhost:8080/#/welcome');
  cy.get('#tab-register').click();

  cy.get('#user').type(username);
  cy.get('#email').type(email);
  cy.get('#pass').type(password);

  cy.contains('button', 'Sign Up').click();
});

Cypress.Commands.add('createProject', (name, description = '') => {
  cy.contains('Create project').click();

  cy.get('.v-dialog').within(() => {
    cy.contains('New project').should('be.visible');
    cy.contains('button', 'Create').should('be.disabled');

    cy.get('#project-title-input').type(name);
    if (description) {
      cy.get('#project-subtitle-input').type(description);
    }

    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});

Cypress.Commands.add('createUnit', (name) => {
  cy.contains('Create unit').click();

  cy.get('.v-dialog').within(() => {
    cy.contains('New Unit').should('be.visible');
    cy.contains('button', 'Create').should('be.disabled');

    cy.get('#unit-name-input').type(name);

    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});
