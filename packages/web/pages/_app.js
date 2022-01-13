import Particles from 'react-tsparticles';
import '../styles/globals.css';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import styled from 'styled-components';

import { networks } from '../auth';
import { CERAMIC_URL, CONNECT_NETWORK } from '../constants';
import useWeb3Modal from '../hooks/useWeb3Modal';

const SelfIdButton = dynamic(() => import('/components/SelfIdButton'), {
  ssr: false,
});
const Provider = dynamic(() => import('/components/SelfIdProvider'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const { web3Modal, web3Provider, connect, disconnect, address } =
    useWeb3Modal();
  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect, web3Modal]);

  return (
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
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Header>
          {!!web3Provider ? (
            <ButtonFrame type="button" onClick={disconnect}>
              <Text>{address.slice(0, 6)}...</Text>
            </ButtonFrame>
          ) : (
            <ButtonFrame type="button" onClick={connect}>
              <Text>Connect</Text>
            </ButtonFrame>
          )}
          <SelfIdButton />
        </Header>
        <Component
          address={address}
          web3Provider={web3Provider}
          {...pageProps}
        />
      </div>
    </Provider>
  );
}

export default MyApp;

const Header = styled.div`
  display: flex;
  padding: 2rem 0;
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
