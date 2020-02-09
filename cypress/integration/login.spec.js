describe('Login', () => {
  beforeEach(() => {
    cy.task('flush:db')
    cy.visit('http://127.0.0.1:8080/#/welcome')
  })
  
  it('Login with valid credentials', () => {
    cy.request('POST', 'http://127.0.0.1:8080/api/users/signup', { 
      email: 'test@test.test',
      password: 'test',
      username: 'test'
    })
    
    cy.get('#tab-login').click()
    cy.get('#username').should('be.visible').type('test')
    cy.get('#password').should('be.visible').type('test')
    cy.contains('button', 'Sign In').click()
    
    cy.contains('Projects')
  })
      
  it('Unable to login with invalid credentials', () => {
    cy.get('#tab-login').click()
    cy.get('#username').should('be.visible').type('keke')
    cy.get('#password').should('be.visible').type('keke')
    cy.contains('button', 'Sign In').click()
    
    cy.contains('Login')
    cy.contains('.toasted', 'Username or password is invalid').should(
      'be.visible'
    )
  })
})