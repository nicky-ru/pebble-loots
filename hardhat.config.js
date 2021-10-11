require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    iotexT: {
      url: "https://babel-api.testnet.iotex.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4690,
      gas: 8500000,
      gasPrice: 1000000000000
    }
    // iotextest: {
    //   provider: () =>
    //     new HDWalletProvider({
    //       privateKeys: [privateKey],
    //       providerOrUrl: "https://babel-api.testnet.iotex.io",
    //       shareNonce: true
    //     }),
    //   network_id: 4690,    // IOTEX mainnet chain id 4689, testnet is 4690
    //   gas: 8500000,
    //   gasPrice: 1000000000000,
    //   skipDryRun: true
    // }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: './src/constants/artifacts',
  }
};
