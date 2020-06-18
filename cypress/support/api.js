Cypress.Commands.add(
  'apiCreateUser',
  (username = 'test', email = 'test@example.com', password = 'testtest') => {
    cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/signup`, {
      username,
      email,
      password,
    })
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

Cypress.Commands.add(
  'apiCreateUnit',
  (jwtToken, name = 'unit') => {
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
  }
);
