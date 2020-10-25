import * as oneshotExample from '../../../fixtures/oneshot-example.json';

describe('Upload oneshot', () => {
  before(() => {
    cy.task('db:drop');
    cy.apiCreateProject();
    cy.apiCreateUnit();
  });

  it('Failed to upload non-JSON object', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/units/test-name.unit/oneshots`,
          body: 'xxxxxxxxxxxxx',
          auth: {
            bearer: response.token,
          },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(400);
        });
      });
  });

  it('Failed to upload an array of objects', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/units/test-name.unit/oneshots`,
          body: [{}, {}, {}],
          auth: {
            bearer: response.token,
          },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(400);
        });
      });
  });

  it('Failed to upload to non-existent unit', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/units/test-xxxxx/oneshots`,
          body: oneshotExample,
          auth: {
            bearer: response.token,
          },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(404);
        });
      });
  });

  it('Failed to apply non-existent template', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env(
            'apiUrl'
          )}/api/units/test-name.unit/oneshots/xxxx`,
          body: oneshotExample,
          auth: {
            bearer: response.token,
          },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(404);
        });
      });
  });

  it('Upload oneshot without template', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/units/test-name.unit/oneshots`,
          body: oneshotExample,
          auth: {
            bearer: response.token,
          },
        }).then((resp) => {
          expect(resp.status).to.eq(201);
        });
      });
  });

  it('Upload oneshot with template', () => {
    cy.apiCreateTemplate('bandit', 'Bandit');
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env(
            'apiUrl'
          )}/api/units/test-name.unit/oneshots/bandit`,
          body: oneshotExample,
          auth: {
            bearer: response.token,
          },
        }).then((resp) => {
          expect(resp.body).to.have.property('statistics');
        });
      });
  });
});
