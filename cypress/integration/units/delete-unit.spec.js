describe('Deleting units', () => {
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

  it('Delete unit', () => {
    cy.createUnit('dast');

    cy.get('.fa-times').click();
    cy.get('.v-dialog').should('be.visible').within(() => {
      cy.contains('Delete unit dast?').should('be.visible');
      cy.contains('button', 'Delete').click();
    })

    cy.get('.v-data-table').within(() => {
      cy.contains('dast').should('not.be.visible');
    })

    cy.get('.toasted').should('be.visible').contains('Deleted successfully');
  });
  
});
