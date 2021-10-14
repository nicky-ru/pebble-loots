const {expect} = require('chai');

describe('LootStake', () => {
  let admin, nftHolder1, nftHolder2, feeReceipient;
  const burnMultiplier = 10;
  const pebblePerBlock = 10;
  const [tokenId1, tokenId2, tokenId3] = [0, 1, 2];
  const dataPoint1 = ["1","","","","","","","","","","","","","",];
  const dataPoint2 = ["2","","","","","","","","","","","","","",];
  const dataPoint3 = ["3","","","","","","","","","","","","","",];

  before('get factories', async () => {
    [admin, nftHolder1, nftHolder2, feeReceipient] = await ethers.getSigners();
    this.PBL = await ethers.getContractFactory('PebbleToken');
    this.PebbleNFT = await ethers.getContractFactory('PebbleDataPoint');
    this.NFTStake = await ethers.getContractFactory('LootStake');
  })

  beforeEach( async () => {
    this.pbl = await this.PBL.connect(admin).deploy();
    await this.pbl.deployed();

    this.nft = await this.PebbleNFT.connect(admin).deploy(this.pbl.address, burnMultiplier);
    await this.nft.deployed();

    this.nftStake = await this.NFTStake
      .connect(admin)
      .deploy(this.pbl.address, this.nft.address, pebblePerBlock, feeReceipient.address);
    await this.nftStake.deployed();

    // preminting nfts
    await this.pbl.connect(admin).transfer(nftHolder1.address, 1000);
    await this.pbl.connect(admin).transfer(nftHolder2.address, 1000);

    await this.pbl.connect(nftHolder1).approve(this.nft.address, 1000);
    await this.pbl.connect(nftHolder2).approve(this.nft.address, 1000);

    await this.nft.connect(nftHolder1).safeMint(nftHolder1.address, dataPoint1);
    await this.nft.connect(nftHolder2).safeMint(nftHolder2.address, dataPoint2);
    await this.nft.connect(nftHolder2).safeMint(nftHolder2.address, dataPoint3);
  })

  describe('deposits', () => {
    it('user should be able to deposit his nft', async () => {
      await this.nft.connect(nftHolder1).setApprovalForAll(this.nftStake.address, true);
      await expect(
        this.nftStake.connect(nftHolder1).deposit(tokenId1)
      )
        .to.emit(this.nftStake, "Deposit")
        .withArgs(nftHolder1.address, tokenId1, 1);
    });
    it('revert if users deposits not his nft', async () => {
      await this.nft.connect(nftHolder1).setApprovalForAll(this.nftStake.address, true);
      await expect(
        this.nftStake.connect(nftHolder1).deposit(tokenId2)
      )
        .to.be.revertedWith("Deposit: not owning item");
    })
  })

  describe('withdrawals', () => {
    beforeEach(async () => {
      await this.nft.connect(nftHolder1).setApprovalForAll(this.nftStake.address, true);
      await this.nftStake.connect(nftHolder1).deposit(tokenId1);
    })
    it('should allow user to withdraw his nft', async () => {
      await expect(
        this.nftStake.connect(nftHolder1).withdraw(tokenId1)
      )
        .to.emit(this.nftStake, "Withdraw")
        .withArgs(nftHolder1.address, tokenId1);
    });
    it('reverts if users tries to withdraw not his nft', async () => {
      await expect(
        this.nftStake.connect(nftHolder1).withdraw(tokenId2)
      )
        .to.be.revertedWith("Withdraw: not good");
    })
  })
})
