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
      utils.shouldThrow(contractInstance.tokenURI(tokenId));
    });
  })
  context("User", () => {
    beforeEach(async () => {
      contractInstance = await TrustedDataLoot.new({from: admin});
    });
    it('is able to claim a token', async () => {
      const intendedBalance = 1;
      await contractInstance.claim({from: alice});
      const aliceBalance = await contractInstance.balanceOf(alice);
      aliceBalance.toNumber().should.equal(intendedBalance);
    });
    it('should show users tokens', async () => {
      const tokenId1 = 1;
      const tokenId2 = 2;

      await contractInstance.claim({from: alice});
      await contractInstance.claim({from: alice});

      const aliceBalance = await contractInstance.balanceOf(alice);
      let tokens = new Array(aliceBalance.toNumber());

      tokens[0] = await contractInstance.tokenOfOwnerByIndex(alice, 0);
      tokens[1] = await contractInstance.tokenOfOwnerByIndex(alice, 1);

      tokens[0].toNumber().should.equal(tokenId1);
      tokens[1].toNumber().should.equal(tokenId2);
    });
    it('should show tokenUri', async () => {
      const tokenId = 1;
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQbFJ5ZFhOMFpXUWdaR0YwWVNCb1lYTm9Pand2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU5EQWlJR05zWVhOelBTSmlZWE5sSWo0d2VEQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQThMM1JsZUhRK1BDOXpkbWMrIn0="
      await contractInstance.claim({from: alice});
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    });
    it('cannot mint same token twice', async () => {
      await contractInstance.claim({from: alice});
      utils.shouldThrow(contractInstance.claim({from: alice}))
    })
    it('should be able to add hash to token', async () => {
      const tokenId = 1;
      const _type = 0;
      const _data = records.encoded[0].raw;
      const _timestamp = parseInt(records.encoded[0].timestamp)
      const expectedUri = "data:application/json;base64,eyJuYW1lIjogIlRydXN0ZWQgZGF0YSBMb290ICMxIiwiZGVzY3JpcHRpb24iOiAiVHJ1c3RlZCBkYXRhIGxvb3QgaXMgYSByZWFsIHdvcmxkIGRhdGEgc3RvcmVkIG9uIGNoYWluLiBTdGF0cywgaW1hZ2VzLCBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eSBhcmUgaW50ZW50aW9uYWxseSBvbWl0dGVkIGZvciBvdGhlcnMgdG8gaW50ZXJwcmV0LiBGZWVsIGZyZWUgdG8gdXNlIFBlYmJsZSBMb290IGluIGFueSB3YXkgeW91IHdhbnQuIiwiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFd2NIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQbFJ5ZFhOMFpXUWdaR0YwWVNCb1lYTm9Pand2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU5EQWlJR05zWVhOelBTSmlZWE5sSWo0d2VEYzVZbU16WlRrMlkyTTRZak0wWVRsaE1HTXdOalE1WkdSalpHVmtNMkppTWpaaU9HUXpORGt3WVRnNU5UVTNPRFl5T1RVME1qVTFaREkwTXpFME56SThMM1JsZUhRK1BDOXpkbWMrIn0="
      await contractInstance.claim({from: alice});
      await contractInstance.setTokenHash(tokenId, _type, _data, _timestamp, {from: alice});
      const tokenUri = await contractInstance.tokenURI(tokenId);
      tokenUri.should.equal(expectedUri);
    })
    it('should be able to add motion data', async () => {
      const tokenId = 1;
      const gyro = records.decoded[0].gyroscope;
      const accel = records.decoded[0].accelerometer;
      await contractInstance.claim({from: alice});
      await contractInstance.setTokenMotion(tokenId, gyro, accel, {from: alice});
      const motion = await contractInstance.getMotion(tokenId);
      motion.gyroscope.map((v, i) => {v.toNumber().should.equal(gyro[i])})
      motion.accelerometer.map((v, i) => {v.toNumber().should.equal(accel[i])})
    })
    it('should be able to add climate data', async () => {
      const tokenId = 1;
      const pressure = records.decoded[0].pressure;
      const humidity = records.decoded[0].humidity;
      const temp = records.decoded[0].temperature;
      const temp2 = records.decoded[0].temperature2;
      const gas = records.decoded[0].gasResistance;
      await contractInstance.claim({from: alice});
      await contractInstance.setTokenClimate(tokenId, pressure, humidity, temp2, temp, gas, {from: alice});
      const climate = await contractInstance.getClimate(tokenId);
      climate.pressure.toNumber().should.equal(pressure);
      climate.humidity.toNumber().should.equal(humidity);
      climate.temperature.toNumber().should.equal(temp);
      climate.temperature2.toNumber().should.equal(temp2);
      climate.gasResistance.toNumber().should.equal(gas);
    });
    it('should be able to add location data', async () => {
      const tokenId = 1;
      const latitude = records.decoded[0].latitude;
      const longitude = records.decoded[0].longitude;
      await contractInstance.claim({from: alice});
      await contractInstance.setTokenLocation(tokenId, latitude, longitude, {from: alice});
      const location = await contractInstance.getLocation(tokenId);
      location.latitude.toNumber().should.equal(latitude);
      location.longitude.toNumber().should.equal(longitude);
    })
    it.only('should be able to add light data', async () => {
      const tokenId = 1;
      const light = records.decoded[0].light;
      await contractInstance.claim({from: alice});
      await contractInstance.setTokenLight(tokenId, light, {from: alice});
      const queriedLight = await contractInstance.getLight(tokenId);
      queriedLight.toNumber().should.equal(light);
    })
  })
})
