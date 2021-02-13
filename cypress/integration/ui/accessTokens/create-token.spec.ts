import { Role } from '../../../../api/src/users/interfaces/user.interface';

describe('API Access Tokens / Create', () => {
  before(() => {
    cy.task('db:drop');
    cy.initAllRoles();
  });

  [Role.OWNER, Role.ADMIN, Role.USER, Role.OBSERVER].forEach((role: Role) => {
    it('Create an access token as ' + role, () => {
      cy.loginAs(role);
      cy.visit(`${Cypress.env('webUrl')}/#/user/tokens`);

      cy.createAccessToken('monitoring');

      cy.get('.v-snack__content').should('be.visible').contains('Success');
      cy.get('.v-dialog--active').within(() => {
        cy.contains('New token created').should('be.visible');
        cy.get('#textToCopy').should('not.have.value', '');
        cy.get('textarea').should('not.have.value', '');
        cy.contains('OK').click();
      });

      cy.get('.v-data-table').within(() => {
        cy.contains('monitoring').should('be.visible');
      });
    });
  });

  it('Unable to create a token with the same name', () => {
    cy.task('db:drop:tokens');

    cy.loginAs('owner');
    cy.visit(`${Cypress.env('webUrl')}/#/user/tokens`);
    
    cy.createAccessToken('monitoring');
    cy.contains('OK').click();
    cy.createAccessToken('monitoring');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.get('.v-dialog--active').should('be.visible');
  });
});
