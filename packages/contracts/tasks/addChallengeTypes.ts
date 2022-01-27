import { LedgerSigner } from "@ethersproject/hardware-wallets";

import { task } from "hardhat/config";
import {
  Contract,
  ContractReceipt,
  ContractTransaction,
} from "@ethersproject/contracts";
import { Signer } from "@ethersproject/abstract-signer";

import { DAOFacet } from "../typechain/DAOFacet";
import { BigNumberish } from "@ethersproject/bignumber";
import { gasPrice } from "../scripts/helperFunctions";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export interface ChallengeTypeOutput {
  name: string;
  description: string;
  id: BigNumberish;
  canBeTransferred: boolean;
  totalQuantity: BigNumberish;
  maxQuantity: BigNumberish;
  prtclePrice: BigNumberish | BigNumberish;
  canPurchaseWithPrtcle: boolean;
}

export interface ChallengeTypeInput {
  name: string;
  description: string;
  id: BigNumberish;
  canBeTransferred: boolean;
  totalQuantity: BigNumberish;
  maxQuantity: BigNumberish;
  prtclePrice: BigNumberish | BigNumberish;
  canPurchaseWithPrtcle: boolean;
}

export interface AddChallengeTypesTaskArgs {
  challengemanager: string;
  diamondaddress: string;
  challengefile: string;
  uploadchallengetypes: boolean;
  sendtochallengemanager: boolean;
}

task("addChallengeTypes", "Adds challengeTypes")
  .addParam("challengemanager", "Address of the challenge manager", "0")
  .addParam("diamondaddress", "Address of the Diamond to upgrade")
  .addParam("challengefile", "File name of the challenges to add")
  .addFlag("uploadchallengetypes", "Upload challengeTypes")
  .addFlag(
    "sendtochallengemanager",
    "Mint and send the challenges to challengeManager"
  )

  .setAction(
    async (
      taskArgs: AddChallengeTypesTaskArgs,
      hre: HardhatRuntimeEnvironment
    ) => {
      const challengeFile: string = taskArgs.challengefile;
      const diamondAddress: string = taskArgs.diamondaddress;
      const challengeManager = taskArgs.challengemanager;
      const sendToChallengeManager = taskArgs.sendtochallengemanager;
      const uploadChallengeTypes = taskArgs.uploadchallengetypes;

      const {
        challengeTypes: currentChallengeTypes,
      } = require(`../scripts/testChallengeTypes.js`);

      const challengeTypesArray: ChallengeTypeOutput[] = currentChallengeTypes;

      let signer: Signer;

      let owner = challengeManager;
      const testing = ["hardhat", "localhost"].includes(hre.network.name);
      if (testing) {
        await hre.network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [owner],
        });
        signer = await hre.ethers.provider.getSigner(owner);
      }
      // else if (hre.network.name === "matic") {
      //   // signer = new LedgerSigner(
      //   //   hre.ethers.provider,
      //   //   "hid",
      //   //   "m/44'/60'/2'/0/0"
      //   // );
      // }
      else {
        throw Error("Incorrect network selected");
      }

      let tx: ContractTransaction;
      let receipt: ContractReceipt;

      let daoFacet = (await hre.ethers.getContractAt(
        "DAOFacet",
        diamondAddress,
        signer
      )) as DAOFacet;

      if (uploadChallengeTypes) {
        console.log("Adding challenges", 0, "to", currentChallengeTypes.length);

        tx = await daoFacet.addChallengeTypes(challengeTypesArray, {
          gasPrice: gasPrice,
        });

        receipt = await tx.wait();
        if (!receipt.status) {
          throw Error(`Error:: ${tx.hash}`);
        }
        console.log("Challenges were added:", tx.hash);
      }

      if (sendToChallengeManager) {
        const challengeIds: BigNumberish[] = [];
        const quantities: BigNumberish[] = [];
        challengeTypesArray.forEach((challengeType: ChallengeTypeOutput) => {
          challengeIds.push(challengeType.id);
          quantities.push(challengeType.maxQuantity);
        });

        console.log("final quantities:", challengeIds, quantities);

        console.log(`Mint challenges to Challenge Manager ${challengeManager}`);

        tx = await daoFacet.mintChallenges(
          challengeManager,
          challengeIds,
          quantities,
          {
            gasPrice: gasPrice,
          }
        );
        receipt = await tx.wait();
        if (!receipt.status) {
          throw Error(`Error:: ${tx.hash}`);
        }

        console.log("Prize challenges minted:", tx.hash);
      }
    }
  );
