import { Role } from '../../../../api/src/users/interfaces/user.interface';

describe('API Access Tokens / Delete', () => {
  before(() => {
    cy.task('db:drop');
    cy.initAllRoles();
  });

  [Role.OWNER, Role.ADMIN, Role.USER, Role.OBSERVER].forEach((role: Role) => {
    it('Delete an access token as ' + role, () => {
      cy.loginAs(role);
      cy.visit(`${Cypress.env('webUrl')}/#/user/tokens`);

      cy.createAccessToken('monitoring');
      cy.get('.v-dialog--active').within(() => {
        cy.contains('OK').click();
      });

      cy.get('.mdi-dots-vertical').click();
      cy.contains('Delete token').click();

      cy.get('.v-dialog--active').within(() => {
        cy.contains('Delete this token?').should('be.visible');
        cy.contains('OK').click();
      });

      cy.get('.v-data-table').within(() => {
        cy.contains('monitoring').should('not.exist');
      });
    });
  });
});
