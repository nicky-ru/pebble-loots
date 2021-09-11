describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should contain Pebble article', function() {
    cy.contains('article', 'Pebble data')
  });
  context('Pebble article', () => {
    it('should link to pebble page', function() {
      cy.contains('a', 'Pebble data').should('have.attr', 'href', '/pebble')
    });
  })
})

export {}
