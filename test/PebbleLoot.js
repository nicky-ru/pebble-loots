const PebbleLoot = artifacts.require("PebbleLoot")
const should = require("chai").should();

contract("PebbleLoot", (accounts) => {
  let contractInstance;
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
      const intendedBalance = BigInt(0);
      const actuallBalance = await contractInstance.balanceOf(alice);
      BigInt(actuallBalance).should.equal(intendedBalance)
    });
    it('should showTotalSupply', async () => {
      const intendedTS = BigInt(0);
      const totalSupply = await contractInstance.totalSupply();
      BigInt(totalSupply).should.equal(intendedTS);
    });
    it('should show tokenURI', async () => {
      const tokenId = 1;
      const tokenUri = await contractInstance.tokenURI(tokenId);
      console.log(tokenUri)
    });
  })
  context("User", () => {
    beforeEach(async () => {
      contractInstance = await PebbleLoot.new({from: admin});
    });
    it('is able to claim a token', async () => {
      const tokenId = 1;
      const intendedBalance = BigInt(1);
      await contractInstance.claim(tokenId, {from: alice});
      const aliceBalance = await contractInstance.balanceOf(alice);
      BigInt(aliceBalance).should.equal(intendedBalance);
    });
  })
})
