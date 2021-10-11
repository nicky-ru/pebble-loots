const {
  expectRevert,
  expectEvent,
  BN,
  ether,
  constants,
  balance,
  send
} = require('@openzeppelin/test-helpers');

const { ZERO_ADDRESS } = constants
const {expect} = require('chai');

describe("Pebble Loots", () => {
  const name = "Pebble Loots";
  const symbol = "PLOOT";
  const mintingFee = 250;

  let feeReceipient, admin, minter;

  before('get factories', async () => {
    [feeReceipient, admin, minter] = await ethers.getSigners();
    this.PebbleLoot = await ethers.getContractFactory('PebbleLoot');

    this.Registration = await ethers.getContractFactory('Registration');
    this.registration = await this.Registration.deploy();
  })

  beforeEach('deploy contract', async () => {
    this.pebbleLoot = await this.PebbleLoot
      .connect(admin)
      .deploy(
        name,
        symbol,
        this.registration.address,
        mintingFee,
        feeReceipient.address
      );
  })

  describe('metadata',() => {
    it('has a name', async () => {
      expect(await this.pebbleLoot.name()).to.be.equal(name);
    });
    it('has a symbol', async () => {
      expect(await this.pebbleLoot.symbol()).to.be.equal(symbol);
    });
    it('has minting fee', async () => {
      expect(await this.pebbleLoot.mintingFee()).to.be.equal(mintingFee);
    });
    it('has fee receipient', async () => {
      expect(await this.pebbleLoot.feeReceipient()).to.be.equal(feeReceipient.address);
    })
  })

  describe('token Uri', () => {
    it('reverts if provided IMEI is incorrect', async () => {

    })
  })
})
