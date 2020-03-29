Cypress.Commands.add('login', (username, password) => {
  cy.get('#tab-login').click();

  cy.get('#username').type(username);
  cy.get('#password').type(password);
  
  cy.contains('button', 'Sign In').click();
});

Cypress.Commands.add('register', (username, email, password) => {
  cy.get('#tab-register').click();

  cy.get('#user').type(username);
  cy.get('#email').type(email);
  cy.get('#pass').type(password);

  cy.contains('button', 'Sign Up').click();
});
