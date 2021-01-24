describe('Projects / Delete', () => {
  before(() => {
    cy.task('db:drop');
  })

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects')
  });
  
  it('Delete project', () => {
    cy.createProject('kkek', 'kekekke');

    cy.get('.mdi-dots-vertical').click();
    cy.contains('Delete Project').click();

    cy.get('.v-dialog').within(() => {
      cy.contains('Delete this project?').should('be.visible');
      cy.contains('OK').click();
    })

    cy.get('.v-snack__content').should('be.visible');
    cy.get('.v-dialog').should('not.be.visible');
    cy.contains('kkek').should('not.exist');
  });
  
});
