describe('Projects', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/welcome');
    cy.login('test', 'testtest');
  });

  it('Create project with all fields', () => {
    cy.contains('Create project').click();

    cy.contains('New project').should('be.visible');

    cy.get('#project-title-input').type('test project');

    cy.get('#project-subtitle-input').type('test desc{enter}');

    cy.contains('test project').should('be.visible');
  });
});
