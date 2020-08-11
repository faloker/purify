import * as oneshotExample from '../../fixtures/oneshot-example.json';

let apiToken = '';
let reportId = '';

describe('Upload oneshot', () => {
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

    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/token`, {
      username: 'test',
      password: 'testtest',
    })
      .its('body')
      .then((response) => {
        apiToken = response.apikey;
      });
  });

  it('Failed to upload non-JSON object', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit`,
      body: 'xxxxxxxxxxxxx',
      headers: { apikey: apiToken },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  it('Failed to upload an array of objects', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit`,
      body: [{}, {}, {}],
      headers: { apikey: apiToken },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  it('Failed to upload to non-existent unit', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-xxxx-xxxx`,
      body: oneshotExample,
      headers: { apikey: apiToken },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
    });
  });

  it('Failed to apply non-existent template', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit/xxxx`,
      body: oneshotExample,
      headers: { apikey: apiToken },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
    });
  });

  it('Upload oneshot without template', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit`,
      body: oneshotExample,
      headers: { apikey: apiToken },
    }).then((resp) => {
      expect(resp.body).to.have.property('_id');
      reportId = resp.body._id;
    });
  });

  it('Upload oneshot with template', () => {
    cy.apiCreateTemplate(apiToken, reportId);

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit/bandit`,
      body: oneshotExample,
      headers: { apikey: apiToken },
    }).then((resp) => {
      expect(resp.body).to.have.property('statistics');
    });
  });
});
