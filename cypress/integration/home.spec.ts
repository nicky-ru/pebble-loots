describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('should contain Devices app', function () {
    cy.contains('article', 'Devices');
  });
  it('should contain loot gallery app', function () {
    cy.contains('article', 'Loot gallery');
  });
  it('should contain mint loot app', function () {
    cy.contains('article', 'Mint Loot');
  });
  it('should contain loot charts app', function () {
    cy.contains('article', 'Loot charts');
  });
  context('Devices app', () => {
    it('should link to devices page', function () {
      cy.contains('a', 'Devices').should('have.attr', 'href', '#/devices');
    });
  });
  context('Loot gallery app', () => {
    it('should link to gallery page', function () {
      cy.contains('a', 'Loot gallery').should('have.attr', 'href', '#/myloots');
    });
  });
  context('Minting app', () => {
    it('should link to minting page', function () {
      cy.contains('a', 'Mint Loot').should('have.attr', 'href', '#/mintLoot');
    });
  });
  context('Loot charts app', () => {
    it('should link to charts page', function () {
      cy.contains('a', 'Loot charts').should('have.attr', 'href', '#/lootcharts');
    });
  });
});

export {};
