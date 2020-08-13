describe('Unit creation', () => {
  before(() => {
    cy.task('flush:db');
    
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/signup`, {
      username: 'test',
      email: 'test@example.com',
      password: 'testtest',
    })
      .its('body')
      .then((response) => {
        cy.apiCreateProject(response.token);
      });
  });

  beforeEach(() => {
    cy.login();
    cy.contains('test title').click();
  });

  it('Create unit', () => {
    cy.createUnit('dast');

    cy.get('.v-dialog').should('not.be.visible');
    cy.get('.v-data-table').within(() => {
      cy.contains('dast').should('be.visible');
    });
  });

  it('Unable to create unit with the same name', () => {
    cy.createUnit('dast');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.get('.v-dialog').should('be.visible');
  });
});
