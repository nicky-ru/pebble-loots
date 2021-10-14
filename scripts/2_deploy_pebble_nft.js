const { PEBBLE_TOKEN_ADDRESS } = require("./constants");
const burnMultiplier = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);


  const PebbleNft = await ethers.getContractFactory('PebbleDataPoint');
  const nft = await PebbleNft.deploy(PEBBLE_TOKEN_ADDRESS, burnMultiplier);
  await nft.deployed();

  console.log('Pebble NFT contract deployed to:', nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
