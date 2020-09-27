// describe.skip('Request API token', () => {
//   before(() => {
//     cy.task('flush:db');
//     cy.apiCreateUser();
//   });

//   it('Request API token with valid credentials', () => {
//     cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/token`, {
//       username: 'test',
//       password: 'testtest',
//     })
//       .its('body')
//       .then((response) => {
//         expect(response).to.have.property('apikey');
//       });
//   });

//   it('Unable to get API token with invalid credentials', () => {
//     cy.request({
//       method: 'POST',
//       url: `${Cypress.env('apiUrl')}/api/auth/token`,
//       body: {
//         username: 'test',
//         password: 'test',
//       },
//       failOnStatusCode: false,
//     })
//       .its('body')
//       .then((response) => {
//         expect(response).to.have.property('error');
//       });
//   });
// });
