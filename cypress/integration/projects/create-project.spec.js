describe('Project creation', () => {
  before(() => {
    cy.task('flush:db');
    cy.apiCreateUser();
  });

  beforeEach(() => {
    cy.login();
  });

  it('Create project with all fields', () => {
    cy.createProject('kkek', 'kekekke');

    cy.contains('New project').should('not.be.visible');
    cy.contains('kkek').should('be.visible');
    cy.contains('kekekke').should('be.visible');
  });

  it('Unable to create project with the same name', () => {
    cy.createProject('kkek', 'kekekke');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.contains('New project').should('be.visible');
  });

  it('Create project without description', () => {
    cy.createProject('another project');

    cy.contains('New project').should('not.be.visible');
    cy.contains('another project').should('be.visible');
  });
});
