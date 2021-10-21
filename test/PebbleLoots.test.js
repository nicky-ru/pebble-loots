const {
  constants,
} = require('@openzeppelin/test-helpers');

const { ZERO_ADDRESS } = constants
const {expect} = require('chai');

describe("Pebble Loots", () => {
  const name = "Pebble Loot";
  const symbol = "PLT";
  const mintingFee = 250;
  const imei1 = 100000000000000;

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
      .ship([imei1], [device1.address])

    await this.registration
      .connect(regOperator)
      .setOwner(imei1, deviceOwner1.address)
  })

  beforeEach('deploy contract', async () => {
    this.pebbleLoot = await this.PebbleLoot
      .connect(admin)
      .deploy(
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
        "data:application/json;base64,eyJuYW1lIjogIlBlYmJsZSB" +
        "JTUVJICMxIiwiZGVzY3JpcHRpb24iOiAiUGViYmxlIExvb3QgaXM" +
        "gYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF" +
        "0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmU" +
        "gaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW5" +
        "0ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGl" +
        "uIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWF" +
        "nZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGN" +
        "Eb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmx" +
        "jblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFF" +
        "pSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1Ykd" +
        "VK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVl" +
        "XMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFMGNIZzd" +
        "JSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJ" +
        "vWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp" +
        "4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGM" +
        "yVWlQbEJsWW1Kc1pTQk1iMjkwSUNNeFBDOTBaWGgwUGp3dmMzWm5QZz09In0="
    }

    it.skip('returns token Uri', async () => {
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
      await expect(
        this.pebbleLoot
          .connect(deviceOwner1)
          .claim(imei1)
      )
        .to.emit(this.pebbleLoot, 'TokenMinted')
        .withArgs(deviceOwner1.address, imei1);
    })
  })

  describe('enumerating', () => {

  })
})
