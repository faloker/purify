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

  it('Add Comment', () => {
    cy.get('.v-list-item__title').first().click();

    cy.get('#commentBtn').should('be.visible').click();

    cy.get('#commentInput').type('test comment #1{enter}');
    cy.contains('test comment').should('be.visible');

    cy.get('#commentInput').type('test comment #2');
    cy.get('button').contains('Post').click();
    cy.contains('test comment #2').should('be.visible');

    cy.get('.v-timeline-item').should('have.length', 3);
  });
});
