describe('Deleting projects', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  })
  
  it('Delete project', () => {
    cy.login();

    cy.createProject('kkek', 'kekekke');

    cy.get('.delete-btn').click();
    cy.contains('Delete this project?').should('be.visible');
    cy.contains('OK').click();

    cy.get('.v-snack__content').should('be.visible');
    cy.get('.v-dialog').should('not.be.visible');
    cy.contains('kkek').should('not.be.visible');
  });
  
});
