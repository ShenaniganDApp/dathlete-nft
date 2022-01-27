import { useMemo } from 'react/cjs/react.development';
import { getDathleteContract } from '../utils';

export const useDathleteContract = (
  web3Provider,
  withSignerIfPossible = true
) => {
  return useMemo(() => {
    try {
      return getDathleteContract(
        withSignerIfPossible ? web3Provider.getSigner() : web3Provider
      );
    } catch {
      return null;
    }
  });
};
