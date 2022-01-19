import { ethers } from 'ethers';
import challengeAbi from '../../contracts/diamondABI/diamond.json';
import localAddresses from '../../contracts/diamondABI/localAddresses.json';

export const GAS_MARGIN = ethers.BigNumber.from(1000);

export const isAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
};

export const getContract = (address, abi, web3Provider) => {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error('Invalid address');
  }
  return new ethers.Contract(address, abi, web3Provider);
};

export const getNewestChallengeType = (web3Provider) => {
  const contract = getContract(
    localAddresses.diamondAddress,
    challengeAbi,
    web3Provider
  ).getNewestChallengeType();

  return contract;
};

export const getChallengeContract = (web3Provider) => {
  const contract = getContract(
    localAddresses.diamondAddress,
    challengeAbi,
    web3Provider
  );
  return contract;
};

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.BigNumber.from(10000));
  return value.add(offset);
}
