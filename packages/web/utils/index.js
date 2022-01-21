import { ethers } from 'ethers';
import challengeAbi from '../../contracts/diamondABI/diamond.json';
import localAddresses from '../../contracts/diamondABI/localAddresses.json';

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
  return new ethers.Contract(address, abi, web3Provider.getSigner());
};

export const getNewestChallengeType = (web3Provider) => {
  console.log('web3Provider: ', web3Provider);
  const contract = getContract(
    localAddresses.diamondAddress,
    challengeAbi,
    web3Provider
  ).getNewestChallengeType();
  console.log('contract: ', contract);
  return contract;
};
