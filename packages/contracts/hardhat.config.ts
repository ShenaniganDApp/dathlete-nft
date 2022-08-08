import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-contract-sizer";
import "solidity-coverage";
import * as dotenv from "dotenv";
import "@typechain/hardhat";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

dotenv.config({ path: "./../../.env" });

require("./tasks/verifyFacet.ts");
// require("./tasks/deployUpgrade.ts");
require("./tasks/generateDiamondABI.ts");
require("./tasks/generateDiamondABI_Zk.ts");
require("./tasks/batchDeposit.ts");
// require("./tasks/addItemTypes.ts");

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
export default {
  networks: {
    // To compile with zksolc, this must be the default network.
    hardhat: {
      zksync: true,
      allowUnlimitedContractSize: true,
    },

    localhost: {
      url: "http://localhost:8545",
    },
    // xdai: {
    //   url: process.env.XDAI_URL,

    //   // url: 'https://rpc-mainnet.maticvigil.com/',
    //   accounts: [process.env.CHALLENGE_MANAGER],
    //   // blockGasLimit: 20000000,
    //   // blockGasLimit: 20000000,
    //   // gasPrice: 1000000000,
    //   // timeout: 90000,
    // },
    // mumbai: {
    //   url: 'https://rpc-mumbai.matic.today',
    //   accounts: [process.env.SECRET],
    //   blockGasLimit: 20000000,
    //   gasPrice: 1000000000
    // },
    // gorli: {
    //   url: process.env.GORLI,
    //   accounts: [process.env.SECRET],
    //   blockGasLimit: 20000000,
    //   gasPrice: 2100000000
    // },
    // kovan: {
    //   url: process.env.KOVAN_URL,
    //   accounts: [process.env.SECRET],
    //   gasPrice: 5000000000
    // },
    // ethereum: {
    //   url: process.env.MAINNET_URL,
    //   accounts: [process.env.SECRET],
    //   blockGasLimit: 20000000,
    //   gasPrice: 2100000000
    // }
  },
  zksolc: {
    version: "1.1.0",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
      },
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
  },

  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: false,
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: true,
  },
  // This is a sample solc configuration that specifies which version of solc to use
  solidity: {
    version: "0.8.15",
  },
};
