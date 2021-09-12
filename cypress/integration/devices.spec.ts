describe('Devices page', () => {
  beforeEach(() => {
    cy.visit('/devices')
  })
  it('should have title', function() {
    cy.contains('h1', 'My devices')
  });
  it('should contain devices list', function() {
    cy.get('li')
  });
})

export {}
