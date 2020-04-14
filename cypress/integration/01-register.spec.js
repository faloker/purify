describe('Registration', () => {
  // before(() => {
  //   cy.task('flush:db');
  // });

  beforeEach(() => {
    cy.visit('http://localhost:8080/#/welcome');
  });

  it('Fails to register with bad email', () => {
    cy.register('keke', 'keke', 'keke');

    cy.contains('Login');

    cy.get('.toasted').should('be.visible');
  });

  it('Register with valid credentials', () => {
    cy.register('test', 'test@test.test', 'testtest');

    cy.contains('Create project');
  });

  it('Fails to register with the same credentials', () => {
    cy.register('test', 'test@test.test', 'testtest');

    cy.contains('Login');

    cy.get('.toasted').should('be.visible').contains('already exists');
  });
});
