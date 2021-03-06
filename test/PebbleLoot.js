const PebbleLoot = artifacts.require("PebbleLoot")
const Registration = artifacts.require("Registration")
const should = require("chai").should();

contract("PebbleLoot", (accounts) => {
  let contractInstance;
  let registrationInstance;
  let admin = accounts[0];
  let alice = accounts[1];

  // it.only('should template', async () => {
  //
  // });

  context("Contract", () => {
    beforeEach(async () => {
      contractInstance = await PebbleLoot.new({from: admin});
    });
    it('should have name', async () => {
      const intendedName = "Pebble Loot";
      const actuallName = await contractInstance.name();
      actuallName.should.equal(intendedName);
    });
    it('should have token symbol', async () => {
      const intendedSymbol = 'PLOOT';
      const actuallSymbol = await contractInstance.symbol();
      actuallSymbol.should.equal(intendedSymbol);
    });
    it('should show owner', async () => {
      const actuallOwner = await contractInstance.owner();
      actuallOwner.should.equal(admin);
    });
    it('should show balance', async () => {
      const intendedBalance = 0;
      const actuallBalance = await contractInstance.balanceOf(alice);
      actuallBalance.toNumber().should.equal(intendedBalance)
    });
    it('should showTotalSupply', async () => {
      const intendedTS = 0;
      const totalSupply = await contractInstance.totalSupply();
      totalSupply.toNumber().should.equal(intendedTS);
    });
    it('should show tokenURI', async () => {
      const tokenId = 1;
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlBlYmJsZSAjMSIsImRlc2NyaXB0aW9uIjogIlBlYmJsZSBMb290IGlzIGEgcmVhbCB3b3JsZCBkYXRhIHN0b3JlZCBvbiBjaGFpbi4gU3RhdHMsIGltYWdlcywgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHkgYXJlIGludGVudGlvbmFsbHkgb21pdHRlZCBmb3Igb3RoZXJzIHRvIGludGVycHJldC4gRmVlbCBmcmVlIHRvIHVzZSBQZWJibGUgTG9vdCBpbiBhbnkgd2F5IHlvdSB3YW50LiIsImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlRXbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016VXdJajQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTSXhNREFsSWlCb1pXbG5hSFE5SWpFd01DVWlJR1pwYkd3OUltSnNZV05ySWlBdlBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeU1DSWdZMnhoYzNNOUltSmhjMlVpUGxCbFltSnNaU0JwYldWcE9pQXhQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9"
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    });
    it.skip('is able to change Registration contract address', async () => {
      const initialAdd = await contractInstance.regAddress();
      const newAdd = '0x2C39DA40c0D67AA16dBbCCD22FFc065549b6c8F6'
      await contractInstance.setRegistrationAddress(newAdd, {from: admin});
      const res = await contractInstance.regAddress();
      res.should.not.equal(initialAdd);
      res.should.equal(newAdd);
    })
  })
  context("User", () => {
    beforeEach(async () => {
      contractInstance = await PebbleLoot.new({from: admin});
      registrationInstance = await Registration.new({from: admin});
    });
    it.only('is able to claim a token', async () => {
      const tokenId = 100000000000005;
      const intendedBalance = 1;

      await contractInstance.setRegistrationAddress(registrationInstance.address, {from: admin});

      await contractInstance.claim(tokenId, {from: alice});
      const aliceBalance = await contractInstance.balanceOf(alice);
      aliceBalance.toNumber().should.equal(intendedBalance);
    });
    it('should show users tokens', async () => {
      const tokenId1 = 100000000000005;
      const tokenId2 = 100000000000006;
      await contractInstance.claim(tokenId1, {from: alice});
      await contractInstance.claim(tokenId2, {from: alice});

      const aliceBalance = await contractInstance.balanceOf(alice);
      let tokens = new Array(aliceBalance.toNumber());

      tokens[0] = await contractInstance.tokenOfOwnerByIndex(alice, 0);
      tokens[1] = await contractInstance.tokenOfOwnerByIndex(alice, 1);

      tokens[0].toNumber().should.equal(tokenId1);
      tokens[1].toNumber().should.equal(tokenId2);
    });
  })
})
