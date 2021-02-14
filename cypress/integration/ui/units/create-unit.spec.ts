describe('Units / Create', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects/test-name/units/overview');
  });

  it('Create unit', () => {
    cy.createUnit('dast');

    cy.get('.v-data-table').within(() => {
      cy.contains('dast').should('be.visible');
    });
  });

  it('Unable to create unit with the same name', () => {
    cy.createUnit('dast');

    cy.get('.v-snack__content').should('be.visible').contains('already exists');
    cy.get('.v-dialog').should('be.visible');
  });
});
