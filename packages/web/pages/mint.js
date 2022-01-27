import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import constants from '../../contracts/diamondABI/localAddresses.json';
import styled from 'styled-components';
import usePoller from '/hooks/usePoller';
import { useGetNewestChallengeType } from '/hooks/useGetNewestChallengeType';
import { useDathleteContract } from '/hooks/useDathleteContract';

import diamondABI from '../../contracts/diamondABI/diamond.json';
import dynamic from 'next/dynamic';
import { ChallengeTypeScreen } from '/components/mint/ChallengeTypeScreen';
import { ChallengeMintScreen } from '/components/mint/ChallengeMintScreen';
import { ProgressBar } from '/components/UI';
import { calculateGasMargin, GAS_MARGIN } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useGetChallengeBalances } from '../hooks/useGetChallengeBalances';

const SelfIdForm = dynamic(() => import('/components/SelfIdForm'), {
  ssr: false,
});

const progressLabels = ['Challenge Type', 'Upload', 'Confirm'];

const Mint = (props) => {
  const { web3Provider, address } = props;
  const { diamondAddress } = constants;
  const activeChallenge = useGetNewestChallengeType(web3Provider);
  const balances = useGetChallengeBalances(address, web3Provider);
  console.log('balances: ', balances);
  const challengeContract = useDathleteContract(web3Provider);

  const [videoUrl, setVideoUrl] = useState('');
  const [index, setIndex] = useState(0);

  usePoller(() => {}, props.pollTime ? props.pollTime : 1999);

  const onAddChallengeTypes = async (types) => {
    const finalizedTypes = types.map((type, index) => {
      return {
        id: activeChallenge.id + index + 1,

        canBeTransferred: false,
        ...type,
      };
    });

    const estimatedGasPrice = await web3Provider

      .getGasPrice()
      .then((gasPrice) =>
        gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100))
      );

    const estimatedGasLimit =
      await challengeContract.estimateGas.addChallengeTypes(finalizedTypes);

    return challengeContract.addChallengeTypes(finalizedTypes, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice,
    });
  };

  const currentPage = (i) => {
    switch (i) {
      case 0:
        return (
          <ChallengeTypeScreen
            addChallengeTypes={onAddChallengeTypes}
            setIndex={setIndex}
          />
        );
      case 1:
        return <ChallengeMintScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 mt-20">
      <ProgressBar progressLabels={progressLabels} index={index} />
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          key={index}
          animate={{ x: 0, y: 0 }}
          initial={{ x: 500, y: 0 }}
          exit={{ x: -500, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
        >
          {currentPage(index)}
        </motion.div>
      </AnimatePresence>

      {/* <Formik
        initialValues={{
          videoUrl: '',
        }}
        onSubmit={({ video }) => {
          const url = 'https://gateway.pinata.cloud/ipfs/' + video;
          setVideoUrl(url);
        }}
      >
        <Form>
          <Field id="video" name="video" placeholder="Paste IPFS hash" />
        </Form>
      </Formik>
      {!!videoUrl && <Player autoPlay={true} controls url={videoUrl} />} */}
      {activeChallenge && (
        <div>
          <p>{activeChallenge.name}</p>
          <p>{activeChallenge.id}</p>
          {/* <SelfIdForm videoUrl={videoUrl} /> */}
        </div>
      )}
    </div>
  );
};

export default Mint;

const FormFrame = styled.form`
  display: flex;
  flex-direction: column;
  /* height: 150px; */
  justify-content: space-around;
`;

const Input = styled.input``;

const DropzoneWrapper = styled.div`
  background-color: lightgrey;
  border: 2px dashed;
  padding: 1.5rem 1rem;
`;
