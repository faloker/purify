describe('Login', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  });

  it('Login with valid credentials', () => {
    cy.login('test', 'testtest');
    cy.contains('Search');
  });

  it('Unable to login with invalid credentials', () => {
    cy.login('fake', 'fakefake');
    cy.contains('Login');
    cy.get('.v-snack__content').should('be.visible');
  });
});
