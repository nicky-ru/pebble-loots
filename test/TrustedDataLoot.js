const TrustedDataLoot = artifacts.require("TrustedDataLoot")
const should = require("chai").should();
const utils = require("./helpers/utils");
const records = require("./fixtures/records.json");

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
      await utils.shouldThrow(contractInstance.tokenURI(tokenId));
    });
  })
  context("User", () => {
    const tokenId = 1;
    const _type = 0;
    const _data = records.encoded[0].raw;
    const _timestamp = parseInt(records.encoded[0].timestamp)
    const gyro = records.decoded[0].gyroscope;
    const accel = records.decoded[0].accelerometer;
    const pressure = records.decoded[0].pressure;
    const humidity = records.decoded[0].humidity;
    const temp = records.decoded[0].temperature;
    const temp2 = records.decoded[0].temperature2;
    const gas = records.decoded[0].gasResistance;
    const latitude = records.decoded[0].latitude;
    const longitude = records.decoded[0].longitude;
    const light = records.decoded[0].light;
    const snr = records.decoded[0].snr;
    const _random = records.decoded[0].random;
    const vbat = records.decoded[0].vbat;

    beforeEach(async () => {
      contractInstance = await TrustedDataLoot.new({from: admin});
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
    it('should be able to add motion data', async () => {
      await contractInstance.setTokenMotion(tokenId, gyro, accel, {from: alice});
      const motion = await contractInstance.getMotion(tokenId);
      motion.gyroscope.map((v, i) => {v.toNumber().should.equal(gyro[i])})
      motion.accelerometer.map((v, i) => {v.toNumber().should.equal(accel[i])})
    })
    it('should be able to add climate data', async () => {
      await contractInstance.setTokenClimate(tokenId, pressure, humidity, temp2, temp, gas, {from: alice});
      const climate = await contractInstance.getClimate(tokenId);
      climate.pressure.toNumber().should.equal(pressure);
      climate.humidity.toNumber().should.equal(humidity);
      climate.temperature.toNumber().should.equal(temp);
      climate.temperature2.toNumber().should.equal(temp2);
      climate.gasResistance.toNumber().should.equal(gas);
    });
    it('should be able to add location data', async () => {
      await contractInstance.setTokenLocation(tokenId, latitude, longitude, {from: alice});
      const location = await contractInstance.getLocation(tokenId);
      location.latitude.toNumber().should.equal(latitude);
      location.longitude.toNumber().should.equal(longitude);
    })
    it('should be able to add light data', async () => {
      await contractInstance.setTokenLight(tokenId, light, {from: alice});
      const queriedLight = await contractInstance.getLight(tokenId);
      queriedLight.toNumber().should.equal(light);
    })
    it('should be able to add snr data', async () => {
      await contractInstance.setTokenSNR(tokenId, snr, {from: alice});
      const queriedSnr = await contractInstance.getSnr(tokenId);
      queriedSnr.toNumber().should.equal(snr);
    })
    it('should be able to add random data', async () => {
      await contractInstance.setTokenRandom(tokenId, _random, {from: alice});
      const queriedRandom = await contractInstance.getRandom(tokenId);
      queriedRandom.toString().should.equal(_random);
    })
    it('should be able to add vbat data', async () => {
      await contractInstance.setTokenVBAT(tokenId, vbat, {from: alice});
      const queriedVbat = await contractInstance.getVbat(tokenId);
      queriedVbat.toNumber().should.equal(vbat);
    })
    it('should be able to get uri with completed data', async () => {
      await contractInstance.setTokenVBAT(tokenId, vbat, {from: alice});
      await contractInstance.setTokenRandom(tokenId, _random, {from: alice});
      await contractInstance.setTokenSNR(tokenId, snr, {from: alice});
      await contractInstance.setTokenLight(tokenId, light, {from: alice});
      await contractInstance.setTokenLocation(tokenId, latitude, longitude, {from: alice});
      await contractInstance.setTokenMotion(tokenId, gyro, accel, {from: alice});
      await contractInstance.setTokenHash(tokenId, _type, _data, _timestamp, {from: alice});
      await contractInstance.setTokenClimate(tokenId, pressure, humidity, temp2, temp, gas, {from: alice});

      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQakI0TnpsaVl6TmxPVFpqWXpoaU16UmhPV0V3WXpBMk5EbGtaR05rWldRelltSXlObUk0WkRNME9UQmhPRGsxTlRjNE5qSTVOVFF5TlRWa01qUXpNVFEzTWp3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlOREFpSUdOc1lYTnpQU0ppWVhObElqNXpibkk2SURVMElIWmlZWFE2SURJeklHeHBaMmgwT2lBeU56d3ZkR1Y0ZEQ0OGRHVjRkQ0I0UFNJeE1DSWdlVDBpTmpBaUlHTnNZWE56UFNKaVlYTmxJajVzWVhScGRIVmtaVG9nTlRZNE16VXhPRE13SUd4dmJtZHBkSFZrWlRvZ01URTBNelk0TlRnNE1Ed3ZkR1Y0ZEQ0OGRHVjRkQ0I0UFNJeE1DSWdlVDBpT0RBaUlHTnNZWE56UFNKaVlYTmxJajV3Y21WemMzVnlaVG9nTXpZZ2FIVnRhV1JwZEhrNklESTNJR2RoY3lCeVpYTnBjM1JoYm1ObE9pQXlPVHd2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU1UQXdJaUJqYkdGemN6MGlZbUZ6WlNJK0lIUmxiWEJsY21GMGRYSmxPaUF6TXlCMFpXMXdaWEpoZEhWeVpUSTZJRE13UEM5MFpYaDBQangwWlhoMElIZzlJakV3SWlCNVBTSXhNakFpSUdOc1lYTnpQU0ppWVhObElqNXlZVzVrYjIwNklESTJQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9"
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    })
  })
})
