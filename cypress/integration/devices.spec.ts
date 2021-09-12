describe('Devices page', () => {
  beforeEach(() => {
    cy.visit('/devices')
  })
  it('should contain devices list', function() {
    cy.get('li')
  });
})

export {}
