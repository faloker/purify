describe('Reports / Upload', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
    cy.apiCreateUnit();
    cy.apiCreateTemplate('bandit', 'Bandit');
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit(
      'http://localhost:8080/#/projects/test-name/units/test-name.unit/reports'
      );
  });

  it('Upload JSON report without template', () => {
    cy.uploadReport('bandit-example.json');
  });  
  
  it('Upload XML report without template', () => {
    cy.uploadReport('zap-example.xml');
  });

  it('Upload report with template', () => {
    cy.contains('Upload report').click();

    cy.get('.v-dialog--active').within(() => {
      cy.get('#file-input').attachFile('bandit-example.json');
      cy.get('#template-name').type('Bandit{enter}');
      cy.contains('button', 'Upload').click();
    });

    cy.get('.v-data-table').within(() => {
      cy.get('.v-chip__content').should('be.visible').contains('bandit');
    });
  });

  it('Upload report and apply a template', () => {
    cy.uploadReport('bandit-example.json');

    cy.contains('button', 'Apply').click();
    cy.get('.v-dialog--active').within(() => {
      cy.get('#apply-template-name').type('Bandit{enter}');
      cy.contains('button', 'Apply').click();
    });

    cy.get('.v-data-table').within(() => {
      cy.get('.v-chip__content').should('be.visible').contains('bandit');
    });
  });
});
