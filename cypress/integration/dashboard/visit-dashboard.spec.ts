describe('Dashboard overview', () => {
  before(() => {
    cy.task('flush:db');

    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/signup`, {
      username: 'test',
      email: 'test@example.com',
      password: 'testtest',
    })
      .its('body')
      .then((response) => {
        cy.apiCreateProject(response.token);
        cy.apiCreateUnit(response.token);
      });
  });

  beforeEach(() => {
    cy.login();
  });

  it('Visit dashboard page without data', () => {
    cy.get('.v-app-bar__nav-icon').click();
    cy.contains('Dashboard').click();

    cy.contains('Select project').should('be.visible');
    cy.contains('Select unit').should('be.visible');
    cy.get('.apexcharts-svg').should('be.visible').should('have.length', 3);
    cy.get('#unitSearch').should('be.disabled');

    cy.get('#projectSearch').click();
    cy.get('.v-list-item__title')
      .should('be.visible')
      .contains('test title')
      .click();

    cy.get('#unitSearch').should('not.be.disabled');
    cy.get('#unitSearch').click();
    cy.get('.v-list-item__title').should('be.visible').contains('unit').click();
  });

  it('Visit dashboard page with data', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/token`, {
      username: 'test',
      password: 'testtest',
    })
      .its('body')
      .then((response) => {
        cy.apiUploadOneshot(response.apikey);
      });
      
    cy.get('.v-app-bar__nav-icon').click();
    cy.contains('Dashboard').click();

    cy.contains('Select project').should('be.visible');
    cy.contains('Select unit').should('be.visible');
    cy.get('.apexcharts-svg').should('be.visible').should('have.length', 3);
    cy.get('#unitSearch').should('be.disabled');

    cy.get('#projectSearch').click();
    cy.get('.v-list-item__title')
      .should('be.visible')
      .contains('test title')
      .click();

    cy.get('#unitSearch').should('not.be.disabled');
    cy.get('#unitSearch').click();
    cy.get('.v-list-item__title').should('be.visible').contains('unit').click();
  });
});
