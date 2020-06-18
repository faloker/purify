describe('Deleting projects', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  })
  
  it('Delete project', () => {
    cy.login();

    cy.createProject('kkek', 'kekekke');

    cy.get('.delete-btn').click();
    cy.contains('Delete project').should('be.visible');
    cy.get('.confirm-delete-btn').click();

    cy.get('.toasted').should('be.visible').contains('Project removed successfully');
    cy.get('.v-dialog').should('not.be.visible');
    cy.contains('kkek').should('not.be.visible');
  });
  
});
