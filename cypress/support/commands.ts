/// <reference path="../support/index.d.ts" />

Cypress.Commands.add('login', (username = 'test', password = 'testtest') => {
  cy.visit(`${Cypress.env('webUrl')}/#/welcome`);

  cy.get('#email').type(username);
  cy.get('#password').type(password);

  cy.contains('button', 'Sign In').click();
});

Cypress.Commands.add('loginAsSystem', () => {
  cy.login('system@purify.com', 'secret');
});


Cypress.Commands.add('createProject', (displayName, description = '') => {
  cy.contains('Create project').click();

  cy.get('.v-dialog').within(() => {
    cy.contains('New Project').should('be.visible');
    cy.contains('button', 'Create').should('be.disabled');

    cy.get('#displayName').type(displayName);

    cy.get('#name').should('be.empty');
    cy.get('.mdi-auto-fix').click();
    // cy.get('#name').should('not.be.empty');

    if (description) {
      cy.get('#description').type(description);
    }

    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});

Cypress.Commands.add('createUnit', (name) => {
  cy.contains('Create unit').click();

  cy.get('.v-dialog').within(() => {
    cy.contains('New Unit').should('be.visible');
    cy.contains('button', 'Create').should('be.disabled');

    cy.get('#displayName').type(name);

    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});

Cypress.Commands.add('createAccessToken', (name) => {
  cy.contains('Create API token').click();

  cy.get('.v-dialog--active').within(() => {
    cy.contains('New API Token').should('be.visible');
    cy.contains('button', 'Create').should('be.disabled');

    cy.get('#tokenName').type(name);
    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});

Cypress.Commands.add('uploadReport', (filename: string) => {
  cy.contains('Upload report').click();

  cy.get('.v-dialog--active').within(() => {
    cy.contains('button', 'Upload').should('be.disabled');
    cy.get('#file-input').attachFile(filename);
    cy.contains('button', 'Upload').should('not.be.disabled').click();
  })

  cy.get('.v-data-table').within(() => {
    cy.contains('button', 'Create').should('be.visible');
  });
});

Cypress.Commands.add('createUser', (email: string) => {
  cy.contains('Create user').click();

  cy.get('.v-dialog--active').within(() => {
    cy.contains('New User').should('be.visible');

    cy.get('#email').type(email);
    cy.get('.v-input--selection-controls__ripple').first().click();
    cy.get('.v-chip__content').contains('test name').should('be.visible');
    cy.get('.v-input--selection-controls__ripple').last().click();
    cy.contains('Create').click();
    cy.contains('button', 'Create').should('not.be.disabled').click();
  });
});

export {};
