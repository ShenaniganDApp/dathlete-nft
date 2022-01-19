/* global ethers hre */
/* eslint-disable  prefer-const */

const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const constants = require("../diamondABI/localAddresses.json");

let signer;
const diamondAddress = constants.diamondAddress;
const gasLimit = 15000000;
const gasPrice = 20000000000;

async function main() {
  const challengeManager = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const newManagers = [
    "0xaa6194a7eA189d11fd5adE366a5e7C98e81aF1Af",
    "0x748De431c0a978f4f5B61dbED749Adca710A282B",
    "0x21412ECED9d4c282b584b42fEaE993fC3C1CF9A6",
  ];

  let owner = challengeManager;
  const testing = ["hardhat", "localhost"].includes(hre.network.name);
  if (testing) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [owner],
    });
    signer = await ethers.provider.getSigner(owner);
  } else if (hre.network.name === "matic") {
    signer = new LedgerSigner(ethers.provider, "hid", "m/44'/60'/2'/0/0");
  } else {
    throw Error("Incorrect network selected");
  }
  let tx;
  let receipt;

  let daoFacet = (
    await ethers.getContractAt("DAOFacet", diamondAddress)
  ).connect(signer);
  console.log("Adding challenge Manager");

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
