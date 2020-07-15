import oneshotExample from '../fixtures/oneshot-example.json';

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

Cypress.Commands.add(
  'apiCreateProject',
  (jwtToken, title = 'test title', subtitle = 'test desc') => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/projects`,
      body: {
        title,
        subtitle,
      },
      auth: {
        bearer: jwtToken,
      },
    });
  }
);

Cypress.Commands.add('apiCreateUnit', (jwtToken, name = 'unit') => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/units`,
    body: {
      name,
      project: 'test-title',
    },
    auth: {
      bearer: jwtToken,
    },
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
})

Cypress.Commands.add(
  'apiCreateTemplate',
  (apiToken, reportId, name = 'bandit') => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/templates`,
      body: {
        path_to_issues: 'results',
        report: reportId,
        name: name,
        title_pattern: 'issue_text',
        subtitle_pattern: 'filename',
        tags: [],
        risk_field: 'issue_severity',
        body_fields: [
          { key: 'code', type: 'text' },
          { key: 'filename', type: 'text' },
          { key: 'issue_confidence', type: 'text' },
          { key: 'issue_severity', type: 'text' },
          { key: 'issue_text', type: 'text' },
        ],
        merge_fields: ['code'],
        title_fields: ['filename', 'issue_text'],
        internal_comparison_fields: ['filename'],
        external_comparison_fields: ['code'],
      },
      headers: { apikey: apiToken },
    });
  }
);
