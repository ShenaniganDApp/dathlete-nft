import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import constants from '/constants';
import styled from 'styled-components';

import ERC20 from '/artifacts/contracts/interfaces/IERC20.sol/IERC20.json';
import dynamic from 'next/dynamic';
import { Formik, Form, Field } from 'formik';
import Player from 'react-player';

const SelfIdForm = dynamic(() => import('/components/SelfIdForm'), {
  ssr: false,
});

const Mint = (props) => {
  const { web3Provider, address } = props;
  const { diamondAddress, prtcleAddress } = constants;
  const [selfId, setSelfId] = useState();
  const [videoUrl, setVideoUrl] = useState('');

  return (
    <Main>
      <Formik
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
      {!!videoUrl && <Player autoPlay={true} controls url={videoUrl} />}
      <div>
        <p> Upload </p>
        <SelfIdForm videoUrl={videoUrl} s />
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
