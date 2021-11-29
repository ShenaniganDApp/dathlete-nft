import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import constants from '/constants';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import ERC20 from '/artifacts/contracts/interfaces/IERC20.sol/IERC20.json';
import dynamic from 'next/dynamic';
const SelfIdButton = dynamic(() => import('/components/SelfIdButton'), { ssr: false });


const initialFormState = {
  title: '',
  description: '',
  animation_url: '',
  attributes: [],
};

export function Mint(props) {
  const { web3Provider, address } = props;
  const { diamondAddress, prtcleAddress } = constants;
  const [selfId, setSelfId] = useState();
  const [formState, setFormState] = useState(initialFormState);
  const [videoUri, setVideoUri] = useState('');
  const [isIPFSUpload, setIsIPFSUpload] = useState(false);


  const onDrop = useCallback((acceptedFiles) => {
    const url = URL.createObjectURL(acceptedFiles[0]);
    setVideoUri(url);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    multiple: false,
    onDrop,
  });

  async function addToPinata(e) {
    const file = acceptedFiles[0];
    let ipfs = await IPFS.create({
      url: 'https://api.pinata.cloud/psa',
    });

    const { cid } = await ipfs.add(file);
    console.log('cid: ', cid);
    const url = `https://gateway.pinata.cloud/ipfs/${cid.string}`;
    setVideoUri(url);
    setIsIPFSUpload(true);
  }

  return (
    <Main>
    <SelfIdButton/> 
      <DropzoneWrapper {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </DropzoneWrapper>
      {acceptedFiles.length > 0 && (
        <div>
          <ButtonFrame onClick={addToPinata}>
            <p>Upload to IPFS</p>
          </ButtonFrame>
        </div>
      )}
      {!!videoUri && <Player autoPlay={true} controls url={videoUri} />}
      <div>
        <p> Upload </p>
        <Form>
          <Input></Input>
          <Input></Input>
          <Input></Input>
        </Form>
      </div>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const Form = styled.form`
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
