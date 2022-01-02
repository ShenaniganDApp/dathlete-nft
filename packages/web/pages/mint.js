import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import constants from '../../contracts/diamondABI/localAddresses.json';
import styled from 'styled-components';
import usePoller from '/hooks/usePoller';

import diamondABI from '../../contracts/diamondABI/diamond.json';
import dynamic from 'next/dynamic';
import { Formik, Form, Field } from 'formik';
import Player from 'react-player';
import ChallengeTypeScreen from '/components/create/ChallengeTypeScreen';
import { ProgressBar } from '/components/UI';
import { utils } from 'ethers';

const SelfIdForm = dynamic(() => import('/components/SelfIdForm'), {
  ssr: false,
});

const progressLabels = ['Challenge Type', 'Upload', 'Confirm'];

const Mint = (props) => {
  const { web3Provider, address } = props;
  const { diamondAddress } = constants;

  const [videoUrl, setVideoUrl] = useState('');
  const [diamondContract, setDiamondContract] = useState();
  const [activeChallenge, setActiveChallenge] = useState({});
  const [index, setIndex] = useState(0);
  


  useEffect(() => {
    if (!address || !web3Provider) return;
    const contract = new ethers.Contract(
      diamondAddress,
      diamondABI,
      web3Provider.getSigner()
    );
    setDiamondContract(contract);
  }, [address, web3Provider]);

  const getNewestChallengeType = async () => {
    if (!diamondContract) return;
    try {
      const challengeType = await diamondContract.getNewestChallengeType();
      setActiveChallenge(challengeType);
    } catch (e) {
      console.log(e);
    }
  };

  const addChallengeTypes = useCallback(
    async (types) => {
      const finalizedTypes = types.map((type, index) => {
        return {
          id: activeChallenge.id + index + 1,
          
          canBeTransferred: false,
          ...type,
        };
      });
      console.log('finalizedTypes: ', finalizedTypes);

      await diamondContract.addChallengeTypes(finalizedTypes);
    },
    [diamondContract]
  );

  usePoller(
    () => {
      getNewestChallengeType();
    },
    props.pollTime ? props.pollTime : 1999
  );

  return (
    <Main>
      <ProgressBar progressLabels={progressLabels} index={index} />
      <ChallengeTypeScreen
        addChallengeTypes={addChallengeTypes}
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
      <div>
        <p>{activeChallenge.name}</p>
        <p>{activeChallenge.id}</p>
        {/* <SelfIdForm videoUrl={videoUrl} /> */}
      </div>
    </Main>
  );
};

export default Mint;

const Main = styled.main`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const FormFrame = styled.form`
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: space-around;
`;

const Input = styled.input``;

const DropzoneWrapper = styled.div`
  background-color: lightgrey;
  border: 2px dashed;
  padding: 1.5rem 1rem;
`;
