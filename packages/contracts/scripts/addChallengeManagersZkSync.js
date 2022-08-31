/* global ethers hre */
/* eslint-disable  prefer-const */

const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const { Provider, Wallet, Contract } = require("zksync-web3");
const constants = require("../diamondABI/zkSyncTestnetAddresses.json");
const diamondAbi = require("../diamondABI/diamond.json");

const ownershipAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let signer;
const diamondAddress = constants.diamondAddress;
const gasLimit = 15000000;
const gasPrice = 20000000000;

async function main() {
  const newManagers = ["0x2CC1F16b20F1eaD65Ad897808E569004295F8027"];

  const testing = ["hardhat", "localhost"].includes(hre.network.name);
  if (testing) {
    const provider = new Provider("https://zksync2-testnet.zksync.dev");
    signer = new Wallet(process.env.PK, provider);
  } else if (hre.network.name === "matic") {
    signer = new LedgerSigner(ethers.provider, "hid", "m/44'/60'/2'/0/0");
  } else {
    throw Error("Incorrect network selected");
  }
  let tx;
  let receipt;

  let daoFacet = new Contract(constants.daoFacetAddress, diamondAbi, signer);
  let ownershipFacet = new Contract(diamondAddress, ownershipAbi, signer);
  console.log("Adding challenge Manager");

  tx = await ownershipFacet.transferOwnership(
    "0x2CC1F16b20F1eaD65Ad897808E569004295F8027"
  );
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Error:: ${tx.hash}`);
  }
  console.log("Owner changed", tx.hash);

  tx = await daoFacet.addChallengeManagers(newManagers);

  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Error:: ${tx.hash}`);
  }
  console.log("Challenges Managers were added:", tx.hash);

  return {
    signer,
    diamondAddress,
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.addTestChallenges;
