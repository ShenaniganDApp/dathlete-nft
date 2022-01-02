import { Provider } from '@self.id/framework';
const SelfIdProvider = ({ children, ...props }) => (
  <Provider client={{ ceramic: 'testnet-clay' }} {...props}>
    {' '}
    {children}
  </Provider>
);

export default SelfIdProvider;
