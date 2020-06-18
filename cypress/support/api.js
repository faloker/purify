Cypress.Commands.add(
  'apiCreateUser',
  (username = 'test', email = 'test@example.com', password = 'testtest') => {
    cy.request('POST', 'http://localhost:3000/api/auth/signup', {
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
      url: 'http://localhost:3000/api/projects',
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
      url: 'http://localhost:3000/api/units',
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
