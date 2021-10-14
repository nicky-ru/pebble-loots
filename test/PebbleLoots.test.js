const {
  constants,
} = require('@openzeppelin/test-helpers');

const { ZERO_ADDRESS } = constants
const {expect} = require('chai');

describe("Pebble Loots", () => {
  const name = "Pebble Loots";
  const symbol = "PLOOT";
  const mintingFee = 250;

  let registrationAddress;
  let feeReceipient, admin, minter, regOperator, deviceOwner1, deviceOwner2, device1, device2, device3;

  before('get factories and init registration', async () => {
    [feeReceipient, admin, minter, regOperator, deviceOwner1, deviceOwner2, device1, device2, device3] = await ethers.getSigners();
    this.PebbleLoot = await ethers.getContractFactory('PebbleLoot');

    this.Registration = await ethers.getContractFactory('Registration');
    this.registration = await this.Registration.connect(admin).deploy();
    registrationAddress = this.registration.address;

    await this.registration
      .connect(admin)
      .grant(regOperator.address)

    await this.registration
      .connect(regOperator)
      .ship([100000000000000], [device1.address])

    await this.registration
      .connect(regOperator)
      .setOwner(100000000000000, deviceOwner1.address)
  })

  beforeEach('deploy contract', async () => {
    this.pebbleLoot = await this.PebbleLoot
      .connect(admin)
      .deploy(
        name,
        symbol,
        registrationAddress,
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

    it('returns token Uri', async () => {
      expect(await this.pebbleLoot.tokenURI(testUri.tokenId)).to.be.equal(testUri.expectedUri);
    });

  })

  describe('updates', () => {
    describe('registration', () => {
      before('deploy new registration address', async () => {
        this.registration = await this.Registration.deploy();
      })
      it('admin is able to update registration contract address', async () => {
        await expect(
          this.pebbleLoot
            .connect(admin)
            .updateRegistration(this.registration.address)
        )
          .to.emit(this.pebbleLoot, 'RegistrationUpdated')
          .withArgs(this.registration.address);
      });
      it('should revert if non admin tries to update', async () => {
        await expect(
          this.pebbleLoot
            .connect(minter)
            .updateRegistration(this.registration.address)
        )
          .to.be.revertedWith('Ownable: caller is not the owner')
      })
    })
    describe('minting fee', () => {
      const newMintingFee = 300;
      it('admin is able to update minting fee', async () =>  {
        await expect(
          this.pebbleLoot
          .connect(admin)
          .updateMintingFee(newMintingFee)
        )
          .to.emit(this.pebbleLoot, 'MintingFeeUpdated')
          .withArgs(newMintingFee);

        expect(await this.pebbleLoot.mintingFee()).to.be.equal(newMintingFee);
      });
      it('should revert if non admin tries to update minting fee', async () => {
        expect(
          this.pebbleLoot
            .connect(minter)
            .updateMintingFee(newMintingFee)
        )
          .to.be.revertedWith('Ownable: caller is not the owner')
      })
    })
    describe('fee receiver', () => {
      it('should allow admin update fee receiver address', async () => {
        await expect(
          this.pebbleLoot
            .connect(admin)
            .updateFeeReceipient(admin.address)
        )
          .to.emit(this.pebbleLoot, 'FeeReceipientUpdated')
          .withArgs(admin.address);

        expect(await this.pebbleLoot.feeReceipient())
          .to.be.equal(admin.address);
      });
      it('should revert if non admin tries to update receiver address', async () => {
        await expect(
          this.pebbleLoot
            .connect(minter)
            .updateFeeReceipient(minter.address)
        )
          .to.be.revertedWith('Ownable: caller is not the owner')
      });
    })
  })

  describe('minting', () => {
    it('should revert if provided IMEI is incorrect', async () => {
      const idBelowRange = 99999999999999;
      const idInRange = idBelowRange + 1;
      const idAboveRange = idInRange * 10;

      expect(
        this.pebbleLoot
          .connect(minter)
          .claim(idBelowRange)
      )
        .to.be.revertedWith('Claim: Token ID is invalid');

      expect(
        this.pebbleLoot
          .connect(minter)
          .claim(idAboveRange)
      )
        .to.be.revertedWith('Claim: Token ID is invalid');
    })
    it('should revert if minter doesnt owns the device', async () => {
      const imei = 100000000000000;
      expect(
        this.pebbleLoot
          .connect(minter)
          .claim(imei)
      )
        .to.be.revertedWith("You should own the device to mint this loot")
    })
    it.skip('device owner should be able to mint nft', async () => {
      const imei = 100000000000000;

      await expect(
        this.pebbleLoot
          .connect(deviceOwner1)
          .claim(imei)
      )
        .to.emit(this.pebbleLoot, 'TokenMinted')
        .withArgs(deviceOwner1.address, imei);
    })
  })
})
