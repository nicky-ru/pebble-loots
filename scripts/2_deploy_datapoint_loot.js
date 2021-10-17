const { PEBBLE_TOKEN_ADDRESS } = require("./constants");
const burnMultiplier = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);

  const DPL = await ethers.getContractFactory('Datapoint Loot');
  const dpl = await DPL.deploy(PEBBLE_TOKEN_ADDRESS, burnMultiplier);
  await dpl.deployed();

  console.log('Datapoint Loot contract deployed to:', dpl.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
