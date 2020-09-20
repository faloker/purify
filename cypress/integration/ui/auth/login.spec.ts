describe('Authentication / Login', () => {
  before(() => {
    // cy.apiCreateUser();
  });

  it('Login with valid credentials', () => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
  });

  it('Unable to login with invalid credentials', () => {
    cy.login('fake', 'fakefake');
    cy.contains('Sign In');
    cy.get('.v-snack__content').should('be.visible').contains('Invalid email/password');
  });
});
