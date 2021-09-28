const TrustedDataLoot = artifacts.require("TrustedDataLoot")
const should = require("chai").should();
const utils = require("./helpers/utils");

contract("TrustedDataLoot", (accounts) => {
  let contractInstance;
  let admin = accounts[0];
  let alice = accounts[1];

  // it.only('should template', async () => {
  //
  // });

  context("Contract", () => {
    beforeEach(async () => {
      contractInstance = await TrustedDataLoot.new({from: admin});
    });
    it('should have name', async () => {
      const intendedName = "Trusted Data Loot";
      const actuallName = await contractInstance.name();
      actuallName.should.equal(intendedName);
    });
    it('should have token symbol', async () => {
      const intendedSymbol = 'TDLT';
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
      utils.shouldThrow(contractInstance.tokenURI(tokenId));
    });
  })
  context("User", () => {
    const dataPoint1 = {
      "_type": 0,
      "_data": "0x0836101718d6b8818f0220f885ada104281d30213824401b481b501e58485842583e604a604260446a023236",
      "_timestamp": 1632667459
    }
    const dataPoint2 = {
      "_type": 0,
      "_data": "0x082c102018f292d68d0220f885ada104281c301e381d4027481e501e584a5848583c602e6032602c6a023336",
      "_timestamp": 1632668120
    }

    beforeEach(async () => {
      contractInstance = await TrustedDataLoot.new({from: admin});
    });
    it('is able to claim a token', async () => {
      const intendedBalance = 1;
      await contractInstance.claim(dataPoint1._type, dataPoint1._data, dataPoint1._timestamp, {from: alice});
      const aliceBalance = await contractInstance.balanceOf(alice);
      aliceBalance.toNumber().should.equal(intendedBalance);
    });
    it('should show users tokens', async () => {
      const tokenId1 = 1;
      const tokenId2 = 2;

      await contractInstance.claim(dataPoint1._type, dataPoint1._data, dataPoint1._timestamp, {from: alice});
      await contractInstance.claim(dataPoint2._type, dataPoint2._data, dataPoint2._timestamp, {from: alice});

      const aliceBalance = await contractInstance.balanceOf(alice);
      let tokens = new Array(aliceBalance.toNumber());

      tokens[0] = await contractInstance.tokenOfOwnerByIndex(alice, 0);
      tokens[1] = await contractInstance.tokenOfOwnerByIndex(alice, 1);

      tokens[0].toNumber().should.equal(tokenId1);
      tokens[1].toNumber().should.equal(tokenId2);
    });
    it('should show tokenUri', async () => {
      const tokenId = 1;
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQbFJ5ZFhOMFpXUWdaR0YwWVNCb1lYTm9Pand2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU5EQWlJR05zWVhOelBTSmlZWE5sSWo0d2VEZzFPRE5oTVdGak0yUTFPV1UxWlRFM05XRmtaVFZrWmpVM1pUVmlNVGt5Tm1RNFpXRm1ZV05sTXpNMVpqYzNOR1pqWWpjeE5XWmhNems1WXpCak5tWThMM1JsZUhRK1BDOXpkbWMrIn0="
      await contractInstance.claim(dataPoint2._type, dataPoint2._data, dataPoint2._timestamp, {from: alice});
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    });
    it('cannot mint same token twice', async () => {
      await contractInstance.claim(dataPoint2._type, dataPoint2._data, dataPoint2._timestamp, {from: alice});
      utils.shouldThrow(contractInstance.claim(dataPoint2._type, dataPoint2._data, dataPoint2._timestamp, {from: alice}))
    })
  })
})
