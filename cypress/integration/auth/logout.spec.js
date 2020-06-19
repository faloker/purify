describe('Logout', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  });
  
  it('Do logout', () => {
    cy.login();
    cy.contains('Search');

    cy.get('#btn-mini-profile').click();
    cy.get('#menu-mini-profile').should('be.visible');
    cy.get('#btn-logout').click();

    cy.get('.toasted').should('be.visible');
    cy.contains('Login');

    cy.visit('http://localhost:8080/#/projects');
    cy.contains('Login');
  });
});
