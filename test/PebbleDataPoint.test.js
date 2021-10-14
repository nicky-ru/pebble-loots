const {expect} = require('chai');

describe('PebbleNFT', () => {
  const name = "PebbleDataPoint";
  const symbol = "PDP";
  let admin, minter;
  const burnMultiplier = 10;
  const dataPoint = ["","","","","","","","","","","","","",""];

  before('get factories', async () => {
    [admin, minter] = await ethers.getSigners();
    this.PebbleNFT = await ethers.getContractFactory('PebbleDataPoint');
    this.PBL = await ethers.getContractFactory('PebbleToken');
  })

  beforeEach('deploy contract', async () => {
    this.pbl = await this.PBL.connect(admin).deploy();
    await this.pbl.deployed();
    this.pebbleNft = await this.PebbleNFT.connect(admin).deploy(this.pbl.address, burnMultiplier);
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
})
