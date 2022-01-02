const ethereumConnectors = [{ key: 'injected' }];

const walletConnectChainId = process.env.NEXT_PUBLIC_WALLETCONNECT_CHAIN_ID;
const walletConnectRpcUrl = process.env.XDAI_URL;
if (
  typeof walletConnectChainId === 'string' &&
  typeof walletConnectRpcUrl === 'string'
) {
  ethereumConnectors.push({
    key: 'walletConnect',
    params: {
      rpc: { [walletConnectChainId]: walletConnectRpcUrl },
    },
  });
}

export const networks = [
  {
    key: 'ethereum',
    connectors: ethereumConnectors,
  },
];
