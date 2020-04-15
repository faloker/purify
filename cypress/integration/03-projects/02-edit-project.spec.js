describe('Editing projects', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/welcome');
    cy.login('test', 'testtest');
  });

  it('Unable to claim another project title', () => {
    cy.get('#project-card-test-project').within(() => {
      cy.get('.edit-btn').click();
    })

    cy.contains('Edit project').should('be.visible');
    cy.contains('test project').should('be.visible');

    cy.get('#project-title-edit-input').clear().type('another project{enter}');

    cy.contains('Edit project').should('be.visible');
    cy.get('.toasted').should('be.visible').contains('already exists');
  });

  it('Edit all project fields', () => {
    cy.get('#project-card-test-project').within(() => {
      cy.get('.edit-btn').click();
    })

    cy.contains('Edit project').should('be.visible');
    cy.contains('test project').should('be.visible');
    cy.contains('test desc').should('be.visible');

    cy.get('#project-title-edit-input').clear().type('new test project');
    cy.get('#project-subtitle-edit-input').clear().type('new test desc{enter}');

    cy.contains('Edit project').should('not.be.visible');
    cy.contains('new test project').should('be.visible');
    cy.contains('new test desc').should('be.visible');
  });
  
});
