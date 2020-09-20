describe('Units / Edit', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects/test-name/units/overview');
  });

  it('Unable to claim another unit name', () => {
    cy.createUnit('dast');
    cy.createUnit('sast');

    cy.get('.mdi-dots-vertical').first().click();
    cy.contains('Edit Unit').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Edit Unit').should('be.visible');

      cy.get('#displayName').clear().type('sast');
      cy.contains('Save').click();
    })
    
    cy.get('.v-dialog--active').should('be.visible');
    cy.get('.v-snack__content').should('be.visible').contains('already exists');
  });

  it('Change unit name', () => {
    cy.get('.mdi-dots-vertical').first().click();
    cy.contains('Edit Unit').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Edit Unit').should('be.visible');

      cy.get('#displayName').clear().type('cast');
      cy.contains('Save').click();
    })
    
    cy.get('.v-dialog--active').should('not.be.visible');
    cy.get('.v-snack__content').should('be.visible').contains('Success');
  });
});
