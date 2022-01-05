import { CeramicClient } from '@ceramicnetwork/http-client';
import { ModelManager } from '@glazed/devtools';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';

import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays';
import ChallengeModel from './datamodels/challenge/schema.json';
import ChallengesListModel from './datamodels/challengesList/schema.json';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

const CERAMIC_URL = 'http://localhost:7007';
const ETH_URL = 'http://localhost:8545';

(async () => {
  const ceramic = new CeramicClient(CERAMIC_URL);

  const key = fromString(process.env.PK, 'base16');
  // Create and authenticate the DID
  const did = new DID({
    provider: new Ed25519Provider(key),
    resolver: getResolver(),
  });
  await did.authenticate();
  ceramic.did = did;

  const manager = new ModelManager(ceramic);
  manager.addJSONModel(ChallengeModel);
  manager.addJSONModel(ChallengesListModel);

  await manager.toPublished();
})();
