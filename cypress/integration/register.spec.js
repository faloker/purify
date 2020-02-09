describe('Registration', () => {
  beforeEach(() => {
    cy.task('flush:db')
    cy.visit('http://localhost:8080/#/welcome')
  })

  it('Fails to register with bad email', () => {
    cy.get('#tab-register').click()
    cy.get('#user').should('be.visible').type('keke')
    cy.get('#email').should('be.visible').type('keke')
    cy.get('#pass').should('be.visible').type('keke')
    cy.contains('button', 'Sign Up').click()
    
    cy.contains('Login')
    cy.contains('.toasted', 'User validation failed: email: is invalid').should(
      'be.visible'
    )
  })

  it('Register with valid credentials', () => {
    cy.get('#tab-register').click()
    cy.get('#user').should('be.visible').type('test')
    cy.get('#email').should('be.visible').type('test@test.test')
    cy.get('#pass').should('be.visible').type('test')
    cy.contains('button', 'Sign Up').click()

    cy.contains('Projects')
  })


  it('Fails to register with the same credentials', () => {
    cy.request('POST', 'http://localhost:8080/api/users/signup', { 
      email: 'test@test.test',
      password: 'test',
      username: 'test'
    })

    cy.get('#tab-register').click()
    cy.get('#user').should('be.visible').type('test')
    cy.get('#email').should('be.visible').type('test@test.test')
    cy.get('#pass').should('be.visible').type('test')
    cy.contains('button', 'Sign Up').click()

    cy.contains('Login')
    cy.contains('.toasted', 'duplicate key error').should(
      'be.visible'
    )
  })
})