import { Role } from '../../../../api/src/users/interfaces/user.interface';

describe('Issues / Edit', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
    cy.apiCreateUnit();
    cy.apiCreateTemplate('bandit', 'Bandit');
    cy.apiUploadOneshot('bandit');
  });

  beforeEach(() => {
    cy.loginAs('owner');
    cy.visit(`${Cypress.env('webUrl')}/#/projects/test-name/overview`);
    cy.contains('Units').click();
    cy.get('.v-data-table').within(() => {
      cy.contains('unit').click();
    });
  });

  it('Edit Issue Attributes', () => {
    cy.get('.v-list-item__title').first().click();

    cy.get('#issue-resolution > .v-chip__content').as('resolutionBtn');
    cy.get('#issue-risk > .v-chip__content').as('riskBtn');

    cy.get('.v-dialog--active').within(() => {
      cy.get('@resolutionBtn')
        .should('be.visible')
        .should('contain.text', 'none');
      cy.get('@riskBtn').should('be.visible');
      cy.get('#issue-date').should('be.visible').should('contain.text', 'ago');
    });

    cy.get('@resolutionBtn').click({ force: true });
    cy.get('.v-list-item__title').contains('Resolved').click();
    cy.get('.v-snack__content').should('be.visible').contains('Success');
    cy.get('@resolutionBtn').should('contain.text', 'resolved');

    cy.get('@riskBtn').click({ force: true });
    cy.get('.v-list-item__title').contains('medium').click();
    cy.get('.v-snack__content').should('be.visible').contains('Success');
    cy.get('@riskBtn').should('contain.text', 'medium');
  });
});
