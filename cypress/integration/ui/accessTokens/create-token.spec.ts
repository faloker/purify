describe('API Access Tokens / Create', () => {
  before(() => {
    cy.task('db:drop');
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/user/tokens');
  });

  it('Create a token', () => {
    cy.createAccessToken('monitoring');

    cy.get('.v-snack__content').should('be.visible').contains('Success');
    cy.get('.v-dialog--active').within(() => {
      cy.contains('New token created').should('be.visible');
      cy.get('#textToCopy').should('not.have.value', '');
      cy.get('#tokenName').should('not.have.value', '');
      cy.get('textarea').should('not.have.value', '');
      cy.contains('OK').click();
    });

    cy.get('.v-dialog--active').should('not.be.visible');
    cy.get('.v-data-table').within(() => {
      cy.contains('monitoring').should('be.visible');
    });
  });

  it('Unable to create a token with the same name', () => {
    cy.createAccessToken('monitoring');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.get('.v-dialog--active').should('be.visible');
  });
});
