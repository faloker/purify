describe('Authentication / Logout', () => {
  before(() => {
    // cy.task('flush:db');
    // cy.apiCreateUser();
  });
  
  it('Do logout', () => {
    cy.loginAsSystem();

    cy.get('#btn-mini-profile').click();
    cy.get('#menu-mini-profile').should('be.visible');
    cy.get('#btn-logout').click();

    cy.contains('Sign In');

    cy.visit('http://localhost:8080/#/projects');
    cy.contains('Sign In');
  });
});
