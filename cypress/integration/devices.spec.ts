describe('Devices page', () => {
  beforeEach(() => {
    cy.visit('/devices')
  })
  it('should have title', function() {
    cy.contains('h1', 'My devices')
  });
  it('should have links to devices', function() {
    cy.get('#devices-list').within(() => {
      cy.get('a')
    })
  });
  it('should contain devices list', function() {
    cy.get('li')
  });
})

export {}
