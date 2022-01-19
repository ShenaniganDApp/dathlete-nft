import { isAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { getNewestChallengeType } from '/utils';

export const useGetNewestChallengeType = (web3Provider) => {
  const [activeChallenge, setActiveChallenge] = useState();

  const updateNewestChallengeType = useCallback(() => {
    let stale = false;

    getNewestChallengeType(web3Provider)
      .then((challengeType) => {
        if (!stale) {
          setActiveChallenge(challengeType);
        }
      })
      .catch((e) => {
        console.log('e: ', e);
        if (!stale) {
          setActiveChallenge(null);
        }
      });

    return () => {
      stale = true;
      setActiveChallenge();
    };
  }, [web3Provider]);

  useEffect(() => updateNewestChallengeType(), [updateNewestChallengeType]);

  return activeChallenge;
};
