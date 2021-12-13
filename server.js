import { Core, RequestClient } from '@self.id/framework';
import { RequestState } from '@self.id/framework';

const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com';

export const core = new Core({ ceramic: CERAMIC_URL });

export function createRequestClient(ctx) {
  return new RequestClient({
    ceramic: CERAMIC_URL,
    cookie: ctx.req.headers.cookie,
  });
}

export async function getRequestState(ctx) {
  const requestClient = createRequestClient(ctx);
  if (requestClient.viewerID != null) {
    await requestClient.prefetch('basicProfile', requestClient.viewerID);
  }
  return requestClient.getState();
}
