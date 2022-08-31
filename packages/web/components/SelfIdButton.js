import { useConnection } from '@self.id/framework';
import { Button } from '/components/UI';

import { useLogin, useLogout } from '/hooks/useLogin';

const style = { color: 'black', width: 200, backgroundColor: 'white' };

function SelfIdButton() {
  const [connection] = useConnection();
  const login = useLogin();
  const logout = useLogout();

  if (connection.status === 'connected') {
    return (
      <button onClick={() => logout()} style={style}>
        Connected
      </button>
    );
  }

  return connection.status === 'connecting' ? (
    <button disabled style={style}>
      Connecting...
    </button>
  ) : (
    <button onClick={() => login()} style={style}>
      Connect SelfId
    </button>
  );
}

export default SelfIdButton;
