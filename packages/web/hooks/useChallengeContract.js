import { useMemo } from 'react/cjs/react.development';
import { getChallengeContract } from '../utils';

export const useChallengeContract = (
  web3Provider,
  withSignerIfPossible = true
) => {
  return useMemo(() => {
    try {
      return getChallengeContract(
        withSignerIfPossible ? web3Provider.getSigner() : null
      );
    } catch {
      return null;
    }
  });
};
