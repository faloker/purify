describe('Editing projects', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  });

  beforeEach(() => {
    cy.login();
  });

  it('Unable to claim another project title', () => {
    cy.createProject('super title', 'dedede');
    cy.createProject('blabla');
    cy.contains('button', 'Edit').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Edit Project').should('be.visible');
      cy.get('#project-title-input').clear().type('blabla{enter}');
      cy.contains('Edit Project').should('be.visible');
    })
    
    cy.get('.v-snack__content').should('be.visible').contains('already exists');
  });

  it('Edit all project fields', () => {
    cy.contains('button', 'Edit').click();
    cy.contains('Edit Project').should('be.visible');
    cy.contains('super title').should('be.visible');
    cy.contains('dedede').should('be.visible');

    cy.get('#project-title-input').clear().type('new test project');
    cy.get('#project-subtitle-input').clear().type('new test desc{enter}');

    cy.contains('Edit Project').should('not.be.visible');
    cy.contains('new test project').should('be.visible');
    cy.contains('new test desc').should('be.visible');
  });
});
