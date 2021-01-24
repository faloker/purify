/// <reference path="../support/index.d.ts" />
import * as oneshotExample from '../fixtures/oneshot-example.json';
import { Role } from '../../api/src/users/interfaces/user.interface';
// import {  assumeRole } from './helpers';

Cypress.Commands.add('assumeRole', (role: Role, memberships?: string[]) => {
  // let bearer = '';

  if (role === Role.OWNER) {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        return cy.wrap(response.token);
        // bearer = response.token;
      });
  } else {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
      email: 'system@purify.com',
      password: 'secret',
    })
      .its('body')
      .then((response) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/api/users`,
          body: {
            email: `${role}@user.com`,
            role: role,
            memberships: memberships || [],
            ssoBypass: true,
          },
          auth: {
            bearer: response.token,
          },
        })
          .its('body')
          .then((response) => {
            cy.request('POST', `${Cypress.env('apiUrl')}/api/change_password`, {
              token: `${response.link.substring(
                response.link.lastIndexOf('/') + 1
              )}`,
              password: 'secret',
            });

            cy.request('POST', `${Cypress.env('apiUrl')}/api/auth`, {
              email: `${role}@user.com`,
              password: 'secret',
            })
              .its('body')
              .then((response) => {
                return cy.wrap(response.token);
              });
          });
      });
  }
});

Cypress.Commands.add('apiCreateUser', (user: any) => {
  cy.assumeRole(Role.OWNER).then((token) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/users`,
      body: user,
      auth: {
        bearer: token,
      },
    });
  });
});

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

Cypress.Commands.add(
  'apiCreateTemplate',
  (name: string, displayName: string) => {
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
  }
);

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
