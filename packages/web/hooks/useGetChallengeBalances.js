import { isAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { getChallengeBalances } from '/utils';

export const useGetChallengeBalances = (address, web3Provider) => {
  const [challenges, setChallenges] = useState([]);

  const updateChallengeBalances = useCallback(() => {
    let stale = false;

    getChallengeBalances(address, web3Provider)
      .then((challenges) => {
        if (!stale) {
          setChallenges(challenges);
        }
      })
      .catch((e) => {
        console.log('e: ', e);
        if (!stale) {
          setChallenges([]);
        }
      });

    return () => {
      stale = true;
      setChallenges([]);
    };
  }, [web3Provider]);

  useEffect(() => updateChallengeBalances(), [updateChallengeBalances]);

  return challenges;
};
