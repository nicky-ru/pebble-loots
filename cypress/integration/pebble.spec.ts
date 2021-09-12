describe('Pebble page', () => {
  const deviceAddress = '0x94ac89a5da0935bcbfade18762a8c5de75fa8ae3';
  beforeEach(() => {
    cy.visit('/devices/' + deviceAddress)
  })
  it('should contain device address', function() {
    cy.contains(deviceAddress);
  });
})

export {}
