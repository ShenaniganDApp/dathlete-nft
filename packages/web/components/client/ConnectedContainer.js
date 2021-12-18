import { ConnectedContainer as BaseContainer } from '@self.id/framework';
import { Button, Text } from 'grommet';

import { useLogin } from '../hooks';

const style = { color: 'white', marginTop: 10, width: 200 };

function ConnectPrompt({ connection }) {
  const login = useLogin();

  const button =
    connection.status === 'connecting' ? (
      <Button disabled label="Connecting..." primary style={style} />
    ) : (
      <Button
        label="Connect"
        onClick={() => void login()}
        primary
        style={style}
      />
    );

  return (
    <>
      <Text weight="bold">
        Please connect your DID to access the data needed by this page.
      </Text>
      {button}
    </>
  );
}

export default function ConnectedContainer({ children }) {
  return (
    <BaseContainer
      renderFallback={(connection) => <ConnectPrompt connection={connection} />}
    >
      {children}
    </BaseContainer>
  );
}
