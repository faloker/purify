describe('API Access Tokens / Delete', () => {
  before(() => {
    cy.task('db:drop');
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/user/tokens');
  });

  it('Delete a token', () => {
    cy.createAccessToken('monitoring');
    cy.get('.v-dialog--active').within(() => {
      cy.contains('OK').click();
    })

    cy.get('.mdi-dots-vertical').click();
    cy.contains('Delete token').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Delete this token?').should('be.visible');
      cy.contains('OK').click();
    })

    cy.get('.v-snack__content').should('be.visible').contains('Success');
    cy.get('.v-data-table').within(() => {
      cy.contains('monitoring').should('not.be.visible');
    });
  });
});
