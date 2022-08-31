/* global ethers hre */
import { Provider, Wallet, Contract } from "zksync-web3";
import dotenv from "dotenv";
import ethers, { BytesLike } from "ethers";
import diamondAbi from "../diamondABI/diamond.json";
dotenv.config({ path: "./../../../.env" });

const partAddress = "0xcd6eAF00b0fBf76Aa621c97bfE2Abb046B26F142";
const diamondAddress = "0x97feadf7250c8A05Abb9F3D595B29c5288b4298a";
(async () => {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet(process.env.PK as string, provider);

  const particleFacet = new Contract(partAddress, diamondAbi, wallet);

  const estimation = await particleFacet.estimateGas.mint();
  const parsedFee = ethers.utils.formatUnits(estimation.toString(), 18);
  console.log(parsedFee);
  const tx = await particleFacet.mint();
  const result = await tx.wait();
  console.log(result);
})();
