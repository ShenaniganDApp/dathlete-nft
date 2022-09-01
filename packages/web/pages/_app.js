import '@rainbow-me/rainbowkit/styles.css';
import Particles from 'react-tsparticles';
import '../styles/globals.css';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import styled from 'styled-components';

import { networks } from '../auth';
import { CERAMIC_URL, CONNECT_NETWORK } from '../constants';
import useWeb3Modal from '../hooks/useWeb3Modal';

import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const SelfIdButton = dynamic(() => import('/components/SelfIdButton'), {
  ssr: false,
});
const Provider = dynamic(() => import('/components/SelfIdProvider'), {
  ssr: false,
});

const zkSyncChain = {
  id: 280,
  name: 'ZKSync 2.0 Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: 'https://zksync2-testnet.zksync.dev',
  },
  blockExplorers: [
    {
      name: 'ZkScan',
      url: 'https://zksync2-testnet.zkscan.io/',
    },
  ],
};

const gnosisChain = {
  id: 100,
  name: 'Gnosis',
  nativeCurrency: { name: 'xDai', symbol: 'XDAI', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.gnosischain.com',
  },
  blockExplorers: [
    {
      name: 'GnosisScan',
      url: 'https://gnosisscan.io',
    },
  ],
};
const { chains, provider } = configureChains(
  [zkSyncChain, gnosisChain],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Dathlete Experiment',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Provider
          auth={{ networks }}
          client={{ ceramic: CERAMIC_URL, connectNetwork: CONNECT_NETWORK }}
        >
          <Particles
            id="tsparticles"
            style={{
              position: 'relative',
              zIndex: -1,
            }}
            options={{
              fpsLimit: 60,
              interactivity: {
                events: {
                  onHover: {
                    enable: true,
                    mode: 'repulse',
                  },
                },
                modes: {
                  bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                  },
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 50,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: '#ffc115',
                },
                links: {
                  color: '#D8F9FF',
                  distance: 150,
                  enable: true,
                  opacity: 0.1,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: 'none',
                  enable: true,
                  outMode: 'bounce',
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    value_area: 1000,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: 'triangle',
                },
                size: {
                  random: true,
                  value: 3,
                },
              },
              detectRetina: true,
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div className=" py-2 h-full flex-start hidden md:visible md:flex">
              <ConnectButton />
              {/* <SelfIdButton /> */}
            </div>

            <Component {...pageProps} />
          </div>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

const Header = styled.div`
  display: flex;
  padding: 2rem 0;
  height: 100%;
  justify-content: flex-start;
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
