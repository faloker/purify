describe('Reports / Delete', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
    cy.apiCreateUnit();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects/test-name/units/test-name.unit/reports');
  });

  it('Delete report', () => {
    cy.uploadReport('bandit-example.json');

    cy.get('.fa-times').click();
    cy.get('.v-dialog--active').within(() => {
      cy.contains('Delete this report?').should('be.visible');
      cy.contains('button', 'OK').click();
    })

    cy.get('.v-snack__content').should('be.visible').contains('Success');
  });
});
