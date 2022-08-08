// @ts-nocheck
/* global ethers hre */
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Provider, Wallet, Contract } from "zksync-web3";
import dotenv from "dotenv";
import { BytesLike } from "ethers";
import diamondAbi from "../diamondABI/diamond.json";
dotenv.config({ path: "./../../../.env" });

const partAddress = "0xcd6eAF00b0fBf76Aa621c97bfE2Abb046B26F142";
const diamondAddress = "0x97feadf7250c8A05Abb9F3D595B29c5288b4298a"(
  async () => {
    const provider = new Provider("https://zksync2-testnet.zksync.dev");
    const wallet = new Wallet(process.env.PK, provider);

    const particleDiamond = new Contract(partAddress, diamondAbi, wallet);

    const estimation = await particleDiamond.estimateGas.mint();
    const parsedFee = ethers.utils.formatUnits(estimation.toString(), 18);
    console.log(parsedFee);

    const tx = await particleDiamond.mint();
    const result = await tx.wait();
    console.log(result);
  }
)();
