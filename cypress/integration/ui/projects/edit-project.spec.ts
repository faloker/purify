describe('Projects / Edit', () => {
  before(() => {
    cy.task('db:drop');
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects')
  });

  it('Unable to claim another project name', () => {
    cy.createProject('super title', 'dedede');
    cy.createProject('blabla');

    cy.get('.mdi-dots-vertical').first().click();
    cy.contains('Edit Project').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Edit Project').should('be.visible');

      cy.get('#name').clear().type('blabla');
      cy.contains('Save').click();

      cy.contains('Edit Project').should('be.visible');
    })
    
    cy.get('.v-snack__content').should('be.visible').contains('already exists');
  });

  it('Edit all project fields', () => {
    cy.get('.mdi-dots-vertical').first().click();
    cy.contains('Edit Project').click();

    cy.get('.v-dialog--active').within(() => {
      cy.contains('Edit Project').should('be.visible');
  
      cy.get('#displayName').clear().type('test name');
      cy.get('#name').clear().type('new-test');
      cy.get('#description').clear().type('new test desc');

      cy.contains('Save').click();
    })

    cy.contains('test name').should('be.visible');
    cy.contains('new-test').should('be.visible');
    cy.contains('new test desc').should('be.visible');

  });
});
