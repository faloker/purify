describe('Projects / Overview', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
    cy.apiCreateUnit();
  });

  beforeEach(() => {
    cy.loginAsSystem();
    cy.contains('Recent Projects');
    cy.visit('http://localhost:8080/#/projects/test-name/overview');
  });

  it('Metrics loaded', () => {
    cy.get('#unitSearch').should('be.visible');
    cy.contains('Time range').should('be.visible');
    cy.get('.v-select__selection').should('be.visible').contains('-1w');

    cy.get('.apexcharts-svg').should('be.visible').should('have.length', 4);

    cy.get('#unitSearch').click();
    cy.get('.v-list-item__title')
      .should('be.visible')
      .contains('unit')
  });

  // it('Visit dashboard page with data', () => {
  //   cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/token`, {
  //     username: 'test',
  //     password: 'testtest',
  //   })
  //     .its('body')
  //     .then((response) => {
  //       cy.apiUploadOneshot(response.apikey);
  //     });
      
  //   cy.get('.v-app-bar__nav-icon').click();
  //   cy.contains('Dashboard').click();

  //   cy.contains('Select project').should('be.visible');
  //   cy.contains('Select unit').should('be.visible');
  //   cy.get('.apexcharts-svg').should('be.visible').should('have.length', 3);
  //   cy.get('#unitSearch').should('be.disabled');

  //   cy.get('#projectSearch').click();
  //   cy.get('.v-list-item__title')
  //     .should('be.visible')
  //     .contains('test title')
  //     .click();

  //   cy.get('#unitSearch').should('not.be.disabled');
  //   cy.get('#unitSearch').click();
  //   cy.get('.v-list-item__title').should('be.visible').contains('unit').click();
  // });
});
