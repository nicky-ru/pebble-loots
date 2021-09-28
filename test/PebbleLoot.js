const PebbleLoot = artifacts.require("PebbleLoot")
const should = require("chai").should();

contract("PebbleLoot", (accounts) => {
  let contractInstance;
  let admin = accounts[0];
  let alice = accounts[1];

  // it.only('should template', async () => {
  //
  // });

  context.skip("Contract", () => {
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
      const tokenUri = await contractInstance.tokenURI(tokenId);
      console.log(tokenUri)
    });
  })
  context.skip("User", () => {
    beforeEach(async () => {
      contractInstance = await PebbleLoot.new({from: admin});
    });
    it('is able to claim a token', async () => {
      const tokenId = 100000000000005;
      const intendedBalance = 1;
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
