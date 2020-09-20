describe('Units / Delete', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects/test-name/units/overview');
  });

  it('Delete unit', () => {
    cy.createUnit('dast');

    cy.get('.mdi-dots-vertical').click();
    cy.contains('Delete Unit').click();

    cy.get('.v-dialog--active').should('be.visible').within(() => {
      cy.contains('Delete this unit?').should('be.visible');
      cy.contains('button', 'OK').click();
    })

    cy.get('.v-data-table').within(() => {
      cy.contains('dast').should('not.be.visible');
    })

    cy.get('.v-snack__content').should('be.visible').contains('Success');
  });
  
});
