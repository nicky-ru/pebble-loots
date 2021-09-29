const TrustedVbat = artifacts.require("TrustedVbat");

module.exports = function (deployer) {
  deployer.deploy(TrustedVbat);
};
