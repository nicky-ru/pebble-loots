const { expect } = require('chai');
const { ether } = require('@openzeppelin/test-helpers')

describe('Datapoint Loot', () => {
  const name = 'Datapoint Loot';
  const symbol = 'DLT';
  let admin, minter, minter2, feeReceipient;
  const burnMultiplier = 10;
  const dataPoint = [
    '2',
    '4.0750732421875',
    '3050.69225',
    '11448.65815',
    '1166811',
    '36.23188400268555',
    '1003.82000732421885',
    '55.755001068115234',
    '1639.67767',
    '[-12, 11, 14]',
    '[-711, -231, 8260]',
    '3443547577'
  ];
  const dataPoint1 = [
    '3',
    '4.0750732421875',
    '3050.69225',
    '11448.65815',
    '1166811',
    '36.23188400268555',
    '1003.82000732421885',
    '55.755001068115234',
    '1639.67767',
    '[-12, 11, 14]',
    '[-711, -231, 8260]',
    '3443547577'
  ];
  const dataPoint2 = [
    '4',
    '4.0750732421875',
    '3050.69225',
    '11448.65815',
    '1166811',
    '36.23188400268555',
    '1003.82000732421885',
    '55.755001068115234',
    '1639.67767',
    '[-12, 11, 14]',
    '[-711, -231, 8260]',
    '3443547577'
  ];
  const dataPoint3 = [
    '5',
    '4.0750732421875',
    '3050.69225',
    '11448.65815',
    '1166811',
    '36.23188400268555',
    '1003.82000732421885',
    '55.755001068115234',
    '1639.67767',
    '[-12, 11, 14]',
    '[-711, -231, 8260]',
    '3443547577'
  ];
  const [token1, token2, token3] = [0, 1, 2];

  before('get factories', async () => {
    [admin, minter, minter2, feeReceipient] = await ethers.getSigners();
    this.DLT = await ethers.getContractFactory('DatapointLoot');
    this.PBL = await ethers.getContractFactory('PebbleToken');
  });

  beforeEach('deploy contract', async () => {
    this.pbl = await this.PBL.connect(admin).deploy();
    await this.pbl.deployed();
    this.dlt = await this.DLT.connect(admin).deploy(this.pbl.address, feeReceipient.address);
    await this.dlt.deployed();
  });

  describe('metadata', () => {
    it('has a name', async () => {
      expect(await this.dlt.name()).to.be.equal(name);
    });
    it('has a symbol', async () => {
      expect(await this.dlt.symbol()).to.be.equal(symbol);
    });
  });

  describe('minting', () => {
    it('should revert if minting fee is not enough', async () => {
      await expect(this.dlt.connect(minter).safeMint(minter.address, dataPoint)).to.be.revertedWith('Minting: insufficient balance for minting NFT');
    });
    it('should mint token if enough pbl', async () => {
      await this.pbl.connect(admin).transfer(minter.address, ether('10').toString());
      await this.pbl.connect(minter).approve(this.dlt.address, ether('10').toString());
      await expect(this.dlt.connect(minter).safeMint(minter.address, dataPoint)).to.emit(this.dlt, 'TokenMinted').withArgs(minter.address, 0);
    });
  });

  describe('getters', () => {
    beforeEach(async () => {
      await this.pbl.connect(admin).transfer(minter.address, ether('10').toString());
      await this.pbl.connect(minter).approve(this.dlt.address, ether('10').toString());
      await this.dlt.connect(minter).safeMint(minter.address, dataPoint);
    });

    it('should show datapoint data', async () => {
      const dp = await this.dlt.tokenToDataPoint(token1);
      expect(dp.toString()).to.be.equal(dataPoint.toString());
    });
  });

  describe('enumeration', () => {
    beforeEach(async () => {
      await this.pbl.connect(admin).transfer(minter.address, ether('10').toString());
      await this.pbl.connect(admin).transfer(minter2.address, ether('10').toString());
      await this.pbl.connect(minter).approve(this.dlt.address, ether('10').toString());
      await this.pbl.connect(minter2).approve(this.dlt.address, ether('10').toString());
      await this.dlt.connect(minter).safeMint(minter.address, dataPoint);
      await this.dlt.connect(minter2).safeMint(minter2.address, dataPoint1);
      await this.dlt.connect(minter).safeMint(minter.address, dataPoint2);
      await this.dlt.connect(minter2).safeMint(minter2.address, dataPoint3);
    });

    it('should list token ids of a user', async () => {
      let tokenIds1 = [];
      let tokenIds2 = [];
      const bal1 = await this.dlt.balanceOf(minter.address);
      const bal2 = await this.dlt.balanceOf(minter2.address);

      for (let i = 0; i < bal1; i++) {
        const tokenId = await this.dlt.tokenOfOwnerByIndex(minter.address, i);
        tokenIds1.push(tokenId);
      }
      for (let i = 0; i < bal2; i++) {
        const tokenId = await this.dlt.tokenOfOwnerByIndex(minter2.address, i);
        tokenIds2.push(tokenId);
      }

      expect(tokenIds1.toString()).to.be.equal([0, 2].toString());
      expect(tokenIds2.toString()).to.be.equal([1, 3].toString());
    });
  });
});
