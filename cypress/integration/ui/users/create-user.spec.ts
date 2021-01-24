describe('Users / Create', () => {
  before(() => {
    cy.task('db:drop');
    cy.task('db:drop:users');
    cy.apiCreateProject();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/users');
  });

  it('Create user', () => {
    cy.createUser('test@test.test');

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Share login link').should('be.visible');
      cy.get('#textToCopy').should('not.have.value', '');
    });

    cy.contains('OK').click();

    cy.get('.v-data-table').within(() => {
      cy.contains('test@test.test').should('be.visible');
    });
  });

  // it('Unable to create unit with the same name', () => {
  //   cy.createUnit('dast');

  //   cy.get('.v-snack__content').should('be.visible').contains('already exists');
  //   cy.get('.v-dialog').should('be.visible');
  // });
});
