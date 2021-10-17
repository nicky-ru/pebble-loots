const { PEBBLE_TOKEN_ADDRESS, DATAPOINT_LOOT_ADDRESS, TREASURY_ADDRESS } = require("./constants");
const pebblePerBlock = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);


  const LootStash = await ethers.getContractFactory('LootStash');
  const stash = await LootStash.deploy(
    PEBBLE_TOKEN_ADDRESS,
    DATAPOINT_LOOT_ADDRESS,
    pebblePerBlock,
    TREASURY_ADDRESS
  );
  await stash.deployed();

  console.log('NFT Stake contract deployed to:', stash.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
