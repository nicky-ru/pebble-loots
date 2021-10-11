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
    const testUri = {
      tokenId: 1,
      expectedUri:
        "data:application/json;base64,eyJuYW1lIjogIlBlYmJsZ" +
        "SAjMSIsImRlc2NyaXB0aW9uIjogIlBlYmJsZSBMb290IGlzIGE" +
        "gcmVhbCB3b3JsZCBkYXRhIHN0b3JlZCBvbiBjaGFpbi4gU3Rhd" +
        "HMsIGltYWdlcywgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHkgYXJ" +
        "lIGludGVudGlvbmFsbHkgb21pdHRlZCBmb3Igb3RoZXJzIHRvI" +
        "GludGVycHJldC4gRmVlbCBmcmVlIHRvIHVzZSBQZWJibGUgTG9" +
        "vdCBpbiBhbnkgd2F5IHlvdSB3YW50LiIsImltYWdlIjogImRhd" +
        "GE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3o" +
        "waWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1ja" +
        "UlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlR" +
        "XbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016V" +
        "XdJajQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDB" +
        "aVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMW" +
        "E5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGR" +
        "wWkhSb1BTSXhNREFsSWlCb1pXbG5hSFE5SWpFd01DVWlJR1pwY" +
        "kd3OUltSnNZV05ySWlBdlBqeDBaWGgwSUhnOUlqRXdJaUI1UFN" +
        "JeU1DSWdZMnhoYzNNOUltSmhjMlVpUGxCbFltSnNaU0JNYjI5M" +
        "ElDTXhQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9"
    }

    it.only('returns token Uri', async () => {
      expect(await this.pebbleLoot.tokenURI(testUri.tokenId)).to.be.equal(testUri.expectedUri);
    });

  })
})
