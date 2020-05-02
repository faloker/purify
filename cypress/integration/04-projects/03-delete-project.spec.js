describe('Deleting projects', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/welcome');
    cy.login('test', 'testtest');
  });

  it('Delete project', () => {
    cy.get('#project-card-another-project').within(() => {
      cy.get('.delete-btn').click();
    })

    cy.contains('Delete project').should('be.visible');

    cy.get('.confirm-delete-btn').click();

    cy.contains('Delete project').should('not.be.visible');
    cy.contains('another project').should('not.be.visible');
  });
  
});
