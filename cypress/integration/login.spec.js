describe('Login', () => {
  beforeEach(() => {
    cy.task('flush:db')
    cy.visit('http://localhost:8080/#/welcome')
  })
  
  it('Login with valid credentials', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/signup', { 
      email: 'test@test.test',
      password: 'testtest',
      username: 'test'
    })
    
    cy.get('#tab-login').click()
    cy.get('#username').should('be.visible').type('test')
    cy.get('#password').should('be.visible').type('testtest')
    cy.contains('button', 'Sign In').click()
    
    cy.contains('Search')
  })
      
  it('Unable to login with invalid credentials', () => {
    cy.get('#tab-login').click()
    cy.get('#username').should('be.visible').type('keke')
    cy.get('#password').should('be.visible').type('keke')
    cy.contains('button', 'Sign In').click()
    
    cy.contains('Login')
    cy.get('.toasted').should(
      'be.visible'
    )
  })
})