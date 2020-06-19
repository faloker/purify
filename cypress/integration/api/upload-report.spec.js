// let apiToken = '';

// before(() => {
//   cy.request('POST', 'http://localhost:3000/api/auth/signup', {
//     username: 'test',
//     email: 'test@example.com',
//     password: 'testtest',
//   })
//     .its('body')
//     .then((response) => {
//       cy.apiCreateProject(response.token);
//       cy.apiCreateUnit(response.token);
//     });

//   cy.request('POST', 'http://localhost:3000/api/auth/token', {
//     username: 'test',
//     password: 'testtest',
//   })
//     .its('body')
//     .then((response) => {
//       apiToken = response.apikey;
//     });
// });

// describe('Upload reports', () => {
//   it('Upload JSON report without template', () => {
//     cy.exec(
//       `curl -H "apikey: ${apiToken}" -F "unit=test-title-unit" -F "file=@cypress/fixtures/bandit-example.json" localhost:3000/api/reports`
//     );
//   });
// });
