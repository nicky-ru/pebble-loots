describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should contain Devices article', function() {
    cy.contains('article', 'Devices')
  });
  it('should contain my loots article', function() {
    cy.contains('article', 'My Loots')
  });
  context('Pebble article', () => {
    it('should link to devices page', function() {
      cy.contains('a', 'Devices').should('have.attr', 'href', '/devices')
    });
  })
})

export {}
