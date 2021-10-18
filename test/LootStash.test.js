const {expect} = require('chai');

describe('Loot Stash', () => {
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
    this.DPL = await ethers.getContractFactory('DatapointLoot');
    this.LootStash = await ethers.getContractFactory('LootStash');
  })

  beforeEach( async () => {
    this.pbl = await this.PBL.connect(admin).deploy();
    await this.pbl.deployed();

    this.dpl = await this.DPL.connect(admin).deploy(this.pbl.address, burnMultiplier, feeReceipient.address);
    await this.dpl.deployed();

    this.stash = await this.LootStash
      .connect(admin)
      .deploy(this.pbl.address, this.dpl.address, pebblePerBlock, feeReceipient.address);
    await this.stash.deployed();

    // preminting nfts
    await this.pbl.connect(admin).transfer(nftHolder1.address, 1000);
    await this.pbl.connect(admin).transfer(nftHolder2.address, 1000);

    await this.pbl.connect(nftHolder1).approve(this.dpl.address, 1000);
    await this.pbl.connect(nftHolder2).approve(this.dpl.address, 1000);

    await this.dpl.connect(nftHolder1).safeMint(nftHolder1.address, dataPoint1);
    await this.dpl.connect(nftHolder2).safeMint(nftHolder2.address, dataPoint2);
    await this.dpl.connect(nftHolder2).safeMint(nftHolder2.address, dataPoint3);
  })

  describe('deposits', () => {
    it('user should be able to deposit his nft', async () => {
      await this.dpl.connect(nftHolder1).setApprovalForAll(this.stash.address, true);
      await expect(
        this.stash.connect(nftHolder1).deposit(tokenId1)
      )
        .to.emit(this.stash, "Deposit")
        .withArgs(nftHolder1.address, tokenId1, 1);
    });
    it('should show staked token ids for each user', async () => {
      await this.dpl.connect(nftHolder1).setApprovalForAll(this.stash.address, true);
      await this.dpl.connect(nftHolder2).setApprovalForAll(this.stash.address, true);

      await this.stash.connect(nftHolder1).deposit(tokenId1);
      await this.stash.connect(nftHolder2).deposit(tokenId2);
      await this.stash.connect(nftHolder2).deposit(tokenId3);

      const ids = await this.stash.connect(nftHolder1).getTokenIds();
      const ids2 = await this.stash.connect(nftHolder2).getTokenIds();

      expect(ids.toString()).to.be.equal([tokenId1].toString())
      expect(ids2.toString()).to.be.equal([tokenId2, tokenId3].toString())
    })
    it('revert if users deposits not his nft', async () => {
      await this.dpl.connect(nftHolder1).setApprovalForAll(this.stash.address, true);
      await expect(
        this.stash.connect(nftHolder1).deposit(tokenId2)
      )
        .to.be.revertedWith("Deposit: not owning item");
    })
  })

  describe('withdrawals', () => {
    beforeEach(async () => {
      await this.dpl.connect(nftHolder1).setApprovalForAll(this.stash.address, true);
      await this.stash.connect(nftHolder1).deposit(tokenId1);
    })
    it('should allow user to withdraw his nft', async () => {
      await expect(
        this.stash.connect(nftHolder1).withdraw(tokenId1)
      )
        .to.emit(this.stash, "Withdraw")
        .withArgs(nftHolder1.address, tokenId1);
    });
    it('should show staked tokens after withdrawal', async () => {
      await this.dpl.connect(nftHolder2).setApprovalForAll(this.stash.address, true);
      await this.stash.connect(nftHolder2).deposit(tokenId2);
      await this.stash.connect(nftHolder2).deposit(tokenId3);
      await this.stash.connect(nftHolder1).getTokenIds();
      await this.stash.connect(nftHolder2).getTokenIds();

      await this.stash.connect(nftHolder1).withdraw(tokenId1);
      await this.stash.connect(nftHolder2).withdraw(tokenId2);

      let ids = await this.stash.connect(nftHolder1).getTokenIds();
      let ids2 = await this.stash.connect(nftHolder2).getTokenIds();

      expect(ids.toString()).to.be.equal([].toString())
      expect(ids2.toString()).to.be.equal([2].toString())
    })
    it('reverts if users tries to withdraw not his nft', async () => {
      await expect(
        this.stash.connect(nftHolder1).withdraw(tokenId2)
      )
        .to.be.revertedWith("Withdraw: not good");
    })
  })
})
