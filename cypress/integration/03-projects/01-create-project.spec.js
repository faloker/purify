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

    cy.contains('New project').should('not.be.visible');
    cy.contains('test project').should('be.visible');
    cy.contains('test desc').should('be.visible');
  });
  
  it('Unable to create project with the same name', () => {
    cy.contains('Create project').click();

    cy.contains('New project').should('be.visible');

    cy.get('#project-title-input').type('test project');
    cy.get('#project-subtitle-input').type('test desc{enter}');

    cy.get('.toasted').should('be.visible').contains('already exists');
    cy.contains('New project').should('be.visible');
  });
  
  it('Create project without description', () => {
    cy.contains('Create project').click();

    cy.contains('New project').should('be.visible');

    cy.get('#project-title-input').type('another project{enter}');

    cy.contains('New project').should('not.be.visible');
    cy.contains('test project').should('be.visible');
  });
  
});
