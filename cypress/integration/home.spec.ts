describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should contain Pebble article', function() {
    cy.contains('article', 'Pebble data')
  });
})
