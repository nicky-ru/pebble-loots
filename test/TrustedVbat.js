const TrustedVbat = artifacts.require("TrustedVbat")
const should = require("chai").should();
const utils = require("./helpers/utils");
const records = require("./fixtures/records.json");

contract("TrustedVbat", (accounts) => {
  let contractInstance;
  let admin = accounts[0];
  let alice = accounts[1];

  // it.only('should template', async () => {
  //
  // });

  context("Contract", () => {
    beforeEach(async () => {
      contractInstance = await TrustedVbat.new("Trusted Vbat Loot", "TVLT", {from: admin});
    });
    it('should have name', async () => {
      const intendedName = "Trusted Vbat Loot";
      const actuallName = await contractInstance.name();
      actuallName.should.equal(intendedName);
    });
    it('should have token symbol', async () => {
      const intendedSymbol = 'TVLT';
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
    it('should throw when token not minted yet', async () => {
      const tokenId = 1;
      await utils.shouldThrow(contractInstance.tokenURI(tokenId));
    });
  })
  context("User", () => {
    const tokenId = 1;
    const _type = 0;
    const _data = records.encoded[0].raw;
    const _timestamp = parseInt(records.encoded[0].timestamp)
    const vbat = records.decoded[0].vbat;

    beforeEach(async () => {
      contractInstance = await TrustedVbat.new("Trusted Vbat Loot", "TVLT", {from: admin});
      await contractInstance.claim({from: alice});
    });
    it('is able to claim a token', async () => {
      const intendedBalance = 1;
      const aliceBalance = await contractInstance.balanceOf(alice);
      aliceBalance.toNumber().should.equal(intendedBalance);
    });
    it('should show users tokens', async () => {
      const tokenId1 = 1;
      const tokenId2 = 2;

      // await contractInstance.claim({from: alice}); already claimed once in beforeeach
      await contractInstance.claim({from: alice});

      const aliceBalance = await contractInstance.balanceOf(alice);
      let tokens = new Array(aliceBalance.toNumber());

      tokens[0] = await contractInstance.tokenOfOwnerByIndex(alice, 0);
      tokens[1] = await contractInstance.tokenOfOwnerByIndex(alice, 1);

      tokens[0].toNumber().should.equal(tokenId1);
      tokens[1].toNumber().should.equal(tokenId2);
    });
    it('should show tokenUri', async () => {
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQakI0TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TUR3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOREFpSUdOc1lYTnpQU0ppWVhObElqNXpibkk2SURBZ2RtSmhkRG9nTUNCc2FXZG9kRG9nTUR3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOakFpSUdOc1lYTnpQU0ppWVhObElqNXNZWFJwZEhWa1pUb2dNQ0JzYjI1bmFYUjFaR1U2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJamd3SWlCamJHRnpjejBpWW1GelpTSStjSEpsYzNOMWNtVTZJREFnYUhWdGFXUnBkSGs2SURBZ1oyRnpJSEpsYzJsemRHRnVZMlU2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJakV3TUNJZ1kyeGhjM005SW1KaGMyVWlQaUIwWlcxd1pYSmhkSFZ5WlRvZ01DQjBaVzF3WlhKaGRIVnlaVEk2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJakV5TUNJZ1kyeGhjM005SW1KaGMyVWlQbkpoYm1SdmJUb2dQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9"
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    });
    it('should be able to add hash to token', async () => {
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQakI0TnpsaVl6TmxPVFpqWXpoaU16UmhPV0V3WXpBMk5EbGtaR05rWldRelltSXlObUk0WkRNME9UQmhPRGsxTlRjNE5qSTVOVFF5TlRWa01qUXpNVFEzTWp3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOREFpSUdOc1lYTnpQU0ppWVhObElqNXpibkk2SURBZ2RtSmhkRG9nTUNCc2FXZG9kRG9nTUR3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOakFpSUdOc1lYTnpQU0ppWVhObElqNXNZWFJwZEhWa1pUb2dNQ0JzYjI1bmFYUjFaR1U2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJamd3SWlCamJHRnpjejBpWW1GelpTSStjSEpsYzNOMWNtVTZJREFnYUhWdGFXUnBkSGs2SURBZ1oyRnpJSEpsYzJsemRHRnVZMlU2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJakV3TUNJZ1kyeGhjM005SW1KaGMyVWlQaUIwWlcxd1pYSmhkSFZ5WlRvZ01DQjBaVzF3WlhKaGRIVnlaVEk2SURBOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJakV5TUNJZ1kyeGhjM005SW1KaGMyVWlQbkpoYm1SdmJUb2dQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9"
      await contractInstance.setTokenHash(tokenId, _type, _data, _timestamp, {from: alice});
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    })
    it('should be able to add vbat data', async () => {
      await contractInstance.setTokenVBAT(tokenId, vbat, {from: alice});
      const queriedVbat = await contractInstance.getVbat(tokenId);
      queriedVbat.toNumber().should.equal(vbat);
    })
    it('should be able to show completed uri', async () => {
      const expectedUri = ""
      await contractInstance.setTokenHash(tokenId, _type, _data, _timestamp, {from: alice});
      await contractInstance.setTokenVBAT(tokenId, vbat, {from: alice});
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    })
  })
})
