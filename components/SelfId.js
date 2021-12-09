import { Provider } from '@self.id/framework';
const SelfId = ({ children }) => (
  <Provider client={{ ceramic: 'testnet-clay' }}> {children}</Provider>
);

export default SelfId;
