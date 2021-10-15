const {expect} = require('chai');

describe('PebbleNFT', () => {
  const name = "PebbleDataPoint";
  const symbol = "PDP";
  let admin, minter, feeReceipient;
  const burnMultiplier = 10;
  const dataPoint = [
    "2",
    "4.0750732421875",
    "3050.69225",
    "11448.65815",
    "1166811",
    "36.23188400268555",
    "1003.82000732421885",
    "55.755001068115234",
    "1639.67767",
    "[-12, 11, 14]",
    "[-711, -231, 8260]",
    "3443547577"
  ];
  const [token1, token2, token3] = [0, 1, 2];

  before('get factories', async () => {
    [admin, minter, feeReceipient] = await ethers.getSigners();
    this.PebbleNFT = await ethers.getContractFactory('PebbleDataPoint');
    this.PBL = await ethers.getContractFactory('PebbleToken');
  })

  beforeEach('deploy contract', async () => {
    this.pbl = await this.PBL.connect(admin).deploy();
    await this.pbl.deployed();
    this.pebbleNft = await this.PebbleNFT.connect(admin).deploy(this.pbl.address, burnMultiplier, feeReceipient.address);
    await this.pebbleNft.deployed();
  })

  describe('metadata',() => {
    it('has a name', async () => {
      expect(await this.pebbleNft.name()).to.be.equal(name);
    });
    it('has a symbol', async () => {
      expect(await this.pebbleNft.symbol()).to.be.equal(symbol);
    });
  })

  describe('minting', () => {
    it('should revert if minting fee is not enough', async () => {
      await expect(
        this.pebbleNft.connect(minter).safeMint(minter.address, dataPoint)
      )
        .to.be.revertedWith('Minting: insufficient balance for minting NFT');
    });
    it('should mint token if enough pbl', async () => {
      await this.pbl.connect(admin).transfer(minter.address, 1000);
      await this.pbl.connect(minter).approve(this.pebbleNft.address, 1000);
      await expect(
        this.pebbleNft.connect(minter).safeMint(minter.address, dataPoint)
      )
        .to.emit(this.pebbleNft, "TokenMinted")
        .withArgs(minter.address, 0);
    })
  })

  describe('getters', () => {
    beforeEach(async () => {
      await this.pbl.connect(admin).transfer(minter.address, 1000);
      await this.pbl.connect(minter).approve(this.pebbleNft.address, 1000);
      await this.pebbleNft.connect(minter).safeMint(minter.address, dataPoint);
    });

    it('should show datapoint data', async () => {
      const dp = await this.pebbleNft.tokenToDataPoint(token1);
      expect(dp.toString()).to.be.equal(dataPoint.toString());
    });
  })
})
