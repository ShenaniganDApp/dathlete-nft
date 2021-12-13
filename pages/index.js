import Head from 'next/head'
import Image from 'next/image'
import { LandingPage } from '/pages/landingPage'
import { Mint } from '/pages/mint'
import Web3Modal from 'web3modal'
import styled from 'styled-components'
import { providers } from 'ethers'
import { useCallback, useEffect, useState, useReducer } from 'react'
import { EthereumAuthProvider } from '@3id/connect'
// import { WebClient, SelfID } from '@self.id/web';
import Player from 'react-player'
import * as IPFS from 'ipfs-http-client'
import { Purchase } from '/pages/purchase'
import WalletConnectProvider from '@walletconnect/web3-provider'

import dynamic from 'next/dynamic';

const SelfIdProvider = dynamic(() => import('../components/SelfId'), {
  ssr: false,
});

const SelfIdButton = dynamic(() => import('/components/SelfIdButton'), {
  ssr: false,
});

const showLanding = false;
const showPurchase = false;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: 'a83b0fa56b894d9daa4aaecc4fbfe712', // required
    },
  },
};

let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect();

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      });
    },
    [provider]
  );

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  // const chainData = getChainData(chainId);

  return (
    <SelfIdProvider>
      <Head>
        <title>The Dathlete Experiment</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showLanding ? (
        <LandingPage />
      ) : (
        <>
          <Header>
            {web3Provider ? (
              <Column>
                <ButtonFrame type="button" onClick={disconnect}>
                  <Text>{address.slice(0, 6)}...</Text>
                </ButtonFrame>
                <ButtonFrame>
                  <SelfIdButton />
                </ButtonFrame>
              </Column>
            ) : (
              <ButtonFrame type="button" onClick={connect}>
                <Text>Connect</Text>
              </ButtonFrame>
            )}
          </Header>
          {showPurchase ? (
            <Purchase address={address} web3Provider={web3Provider} />
          ) : (
            <Mint address={address} web3Provider={web3Provider} />
          )}
          {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
        </>
      )}
    </SelfIdProvider>
  );
}

const Header = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  justify-content: flex-end;
`;

const ButtonFrame = styled.button`
  background-color: cadetblue;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-radius: 15px;
`;

const Text = styled.p`
  color: whitesmoke;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;