async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);

  const PBL = await ethers.getContractFactory('PebbleToken');
  const pbl = await PBL.deploy();
  await pbl.deployed();

  console.log('Pebble Token deployed to:', pbl.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
