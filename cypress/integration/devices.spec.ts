describe('Devices page', () => {
  // beforeEach(() => {
  //   cy.visit('#/devices')
  // });
  it('should fetch devices', function() {
    cy.server()
    cy.route(
      'GET',
      'https://protoreader.herokuapp.com/api/devices',
      'fixture:devices'
    ).as('devices')

    cy.visit('#/devices')
    cy.get('tr')
      .should('have.length', 4);
    
  });
})

export {}
