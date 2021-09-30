const TrustedDataLoot = artifacts.require("TrustedDataLoot");

module.exports = function (deployer) {
  deployer.deploy(TrustedDataLoot, "Trusted Data Loot", "TDLT");
};
