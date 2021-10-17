const { REGISTRATION_ADDRESS, TREASURY_ADDRESS } = require("./constants");
const mintingFee = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);


  const PebbleLoot = await ethers.getContractFactory('PebbleLoot');
  const plt = await PebbleLoot.deploy(REGISTRATION_ADDRESS, mintingFee, TREASURY_ADDRESS);
  await plt.deployed();

  console.log('Pebble Loot contract deployed to:', plt.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
