describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/welcome');
  });

  it('Login with valid credentials', () => {
    cy.login('test', 'testtest');

    cy.contains('Search');
  });

  it('Unable to login with invalid credentials', () => {
    cy.login('fake', 'fakefake');

    cy.contains('Login');

    cy.get('.toasted').should('be.visible');
  });
});
