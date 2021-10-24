describe('Devices page', () => {
  beforeEach(() => {
    cy.server();
  });
  it('should fetch devices', function () {
    cy.route('GET', 'https://protoreader.herokuapp.com/api/devices', 'fixture:devices').as('devices');

    cy.visit('#/devices');
    cy.get('tr').should('have.length', 4);
  });
  it('should fetch devices from remote server', function () {
    cy.intercept({
      method: 'GET',
      url: 'https://protoreader.herokuapp.com/api/devices'
    }).as('devices');
    cy.visit('#/devices');

    cy.get('tr').should('have.length.above', 10);
  });
});

export {};
