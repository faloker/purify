/// <reference path="../support/index.d.ts" />
import * as oneshotExample from '../fixtures/oneshot-example.json';

Cypress.Commands.add(
  'apiCreateUser',
  (username = 'test', email = 'test@example.com', password = 'testtest') => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/signup`, {
      username,
      email,
      password,
    });
  }
);
// Cypress.Commands.add(
//   'loginAsSystem',
//   () => {
//     cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/signup`, {
//       email: 'system@purify.com',
//       email,
//       password,
//     });
//   }
// );

Cypress.Commands.add(
  'apiCreateProject',
  (displayName = 'test name', name = 'test-name', description = 'desc') => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/projects`,
          body: {
            displayName,
            name,
            description,
          },
          auth: {
            bearer: response.token,
          },
        });
      });
  }
);

Cypress.Commands.add('apiCreateUnit', (displayName = 'unit') => {
  cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
    email: 'system@purify.com',
    password: 'secret',
  })
    .its('body')
    .then((response) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/api/projects/test-name/units`,
        body: {
          displayName,
        },
        auth: {
          bearer: response.token,
        },
      });
    });
});

Cypress.Commands.add('apiCreateTemplate', (name: string, displayName: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
    email: 'system@purify.com',
    password: 'secret',
  })
    .its('body')
    .then((response) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/api/templates`,
        body: {
          name: name,
          displayName: displayName,
          pathToIssues: 'results',
          titlePattern: 'issue_text',
          subtitlePattern: 'filename',
          tags: [],
          riskField: 'issue_severity',
          bodyFields: [
            { key: 'code', type: 'text' },
            { key: 'filename', type: 'text' },
            { key: 'issue_confidence', type: 'text' },
            { key: 'issue_severity', type: 'text' },
            { key: 'issue_text', type: 'text' },
          ],
          mergeFields: ['code'],
          titleFields: ['filename', 'issue_text'],
          internalComparisonFields: ['filename'],
          externalComparisonFields: ['code'],
        },

        auth: {
          bearer: response.token,
        },
      });
    });
});

Cypress.Commands.add('apiUploadOneshot', (apiToken) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/upload/oneshot/test-title-unit`,
    body: oneshotExample,
    headers: { apikey: apiToken },
  }).then((resp) => {
    cy.apiCreateTemplate(apiToken, resp.body._id);
  });
});
