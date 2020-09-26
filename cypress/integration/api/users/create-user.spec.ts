describe('API / Users / Create', () => {
  before(() => {
    cy.task('db:drop');
    cy.task('db:drop:users');
  });

  it('Create a user with empty membership', () => {
    cy.apiCreateUser({
      email: 'cc@cc.cc',
      role: 'admin',
      memberships: [],
      ssoBypass: true,
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
});
