import { writeFile } from 'node:fs/promises';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ModelManager } from '@glazed/devtools';
import { DID } from 'dids';
import ThreeIdProvider from '3id-did-provider';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';

import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays';
import ChallengeSchema from './datamodels/challenge/schema.json';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

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

  // Create a manager for the model
  const manager = new ModelManager(ceramic);

  const challengeSchemaID = await manager.createSchema(
    'Challenge',
    ChallengeSchema
  );

  // Create the definition using the created schema ID
  await manager.createDefinition('DathleteChallenge', {
    name: 'Dathlete Challenge',
    description: 'A single challenge for a dathlete',
    schema: manager.getSchemaURL(challengeSchemaID),
  });

  //@TODO: publish a test video to ipfs by convrting an mp4 to the hls format

  // Create a tile using the created schema ID
  await manager.createTile(
    'TheVoid',
    {
      title: 'TheVoid',
      description: 'TheVoid',
      story: {
        alternatives: [],
        original: {
          src: 'ipfs://QmUzgZSJxcVakAho8stC9izdWjqctYNHYyqr7hSUtmC3z8',
          height: 369,
          width: 369,
          mimeType: 'image/png',
          size: 23658,
          duration: 1,
        },
      },
      video: {
        alternatives: [],
        original: {
          src: 'ipfs://QmUzgZSJxcVakAho8stC9izdWjqctYNHYyqr7hSUtmC3z8',
          height: 369,
          width: 369,
          mimeType: 'image/png',
          size: 23658,
          duration: 1,
        },
      },
    },
    { schema: manager.getSchemaURL(challengeSchemaID) }
  );

  // Publish model to Ceramic node
  const model = await manager.toPublished();

  // Write published model to JSON file
  await writeFile('src/datamodels/challenge/model.json', JSON.stringify(model));
})();
