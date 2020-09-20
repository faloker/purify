describe('Projects / Create', () => {
  before(() => {
    cy.task('db:drop');
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects')
  });

  it('Create project with all fields', () => {
    cy.createProject('kkek', 'kekekke');

    cy.contains('New Project').should('not.be.visible');
    cy.contains('kkek').should('be.visible');
    cy.contains('kekekke').should('be.visible');
  });

  it('Unable to create project with the same name', () => {
    cy.createProject('kkek', 'kekekke');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.contains('New Project').should('be.visible');
  });

  it('Create project without description', () => {
    cy.createProject('another project');

    cy.contains('New Project').should('not.be.visible');
    cy.contains('another project').should('be.visible');
  });
});
