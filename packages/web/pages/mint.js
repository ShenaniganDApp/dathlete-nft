import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import constants from '../../contracts/diamondABI/zkSyncTestnetAddresses.json';
import styled from 'styled-components';
import usePoller from '/hooks/usePoller';

import diamondABI from '../../contracts/diamondABI/diamond.json';
import dynamic from 'next/dynamic';
import { Formik, Form, Field } from 'formik';
import Player from 'react-player';
import ChallengeTypeScreen from '/components/mint/ChallengeTypeScreen';
import { ProgressBar } from '/components/UI';
import { calculateGasMargin, GAS_MARGIN } from '../utils';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
} from 'wagmi';

const SelfIdForm = dynamic(() => import('/components/SelfIdForm'), {
  ssr: false,
});

const progressLabels = ['Challenge Type', 'Upload', 'Confirm'];

const Mint = (props) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [index, setIndex] = useState(0);
  const [finalizedTypes, setFinalizedTypes] = useState([]);
  const { address, isConnected } = useAccount();
  console.log('address: ', address);
  const { diamondAddress } = constants;
  const { data: activeChallenge } = useContractRead({
    addressOrName: constants.challengesFacetAddress,
    contractInterface: diamondABI,
    functionName: 'getNewestChallengeType',
  });
  // const activeChallenge = useGetNewestChallengeType(web3Provider);
  // const challengeContract = useCsontractWrite(web3Provider);

  const { config } = usePrepareContractWrite({
    addressOrName: constants.challengesFacetAddress,
    contractInterface: diamondABI,
    functionName: 'addChallengeTypes',
    args: finalizedTypes,
  });
  const {
    data: addChallengeTypesData,
    isLoading,
    isSuccess,
    write: addChallengeTypes,
  } = useContractWrite(config);
  const {
    data: feeData,

    isError: isFeeError,
    isLoading: isFeeLoading,
  } = useFeeData({ chainId: 280 });

  const onAddChallengeTypes = async (types) => {
    const finalizedTypes = types.map((type, index) => {
      return {
        id: activeChallenge.id + index + 1,

        canBeTransferred: false,
        ...type,
      };
    });
    setFinalizedTypes(finalizedTypes);

    return addChallengeTypes();
  };

  return (
    <Main>
      <ProgressBar progressLabels={progressLabels} index={index} />
      <ChallengeTypeScreen
        onAddChallengeTypes={onAddChallengeTypes}
        setIndex={setIndex}
      />
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
    </Main>
  );
};

export default Mint;

const Main = styled.main`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

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
