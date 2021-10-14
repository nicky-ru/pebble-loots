const { PEBBLE_TOKEN_ADDRESS, PEBBLE_NFT_ADDRESS, TREASURY_ADDRESS } = require("./constants");
const pebblePerBlock = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);


  const NftStake = await ethers.getContractFactory('LootStake');
  const stake = await NftStake.deploy(
    PEBBLE_TOKEN_ADDRESS,
    PEBBLE_NFT_ADDRESS,
    pebblePerBlock,
    TREASURY_ADDRESS
  );
  await stake.deployed();

  const PBL = await ethers.getContractFactory('PebbleToken');
  const pbl = await PBL.attach(PEBBLE_TOKEN_ADDRESS);
  await pbl.transfer(stake.address, 3000000);

  console.log('NFT Stake contract deployed to:', stake.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
