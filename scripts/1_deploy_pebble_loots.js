async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Pebble Loot with address:', deployerAddress);

  const PebbleLoot = await ethers.getContractFactory('PebbleLoot');
  const contract = await PebbleLoot.deploy(
    'Pebble Loots',
    'PLOOT',
    '0x2C39DA40c0D67AA16dBbCCD22FFc065549b6c8F6',
    250,
    '0xE9cebA328C78a43A492463f72DE80e4e1a2Df04d'
  );

  await contract.deployed();

  console.log('Pebble Loot deployed at', contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
