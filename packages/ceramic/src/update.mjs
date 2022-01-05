import { writeFile } from 'node:fs/promises';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ModelManager } from '@glazed/devtools';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';

import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays';
import ChallengeSchema from './datamodels/challenge/schema.json';
import ChallengesListSchema from './datamodels/challengesList/schema.json';
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

  // Create a manager for the model
  const challengeManager = new ModelManager(ceramic);
  const challengeListManager = new ModelManager(ceramic);

  const challengeSchemaID = await challengeManager.createSchema(
    'Challenge',
    ChallengeSchema
  );

  const challengesListSchemaID = await challengeListManager.createSchema(
    'ChallengesList',
    ChallengesListSchema
  );

  // Create the definition using the created schema ID
  await challengeManager.createDefinition('DathleteChallenge', {
    name: 'Dathlete Challenge',
    description: 'A single challenge for a dathlete',
    schema: challengeManager.getSchemaURL(challengeSchemaID),
  });

  await challengeListManager.createDefinition('DathleteChallengesList', {
    name: 'Dathlete Challenges List',
    description: 'A list of challenges for a dathlete',
    schema: challengeListManager.getSchemaURL(challengesListSchemaID),
  });

  // Create a tile using the created schema ID
  await challengeManager.createTile(
    'TheVoid',
    {
      title: 'TheVoid',
      description: 'TheVoid',
      image: {
        alternatives: [],
        original: {
          src: 'ipfs://QmUzgZSJxcVakAho8stC9izdWjqctYNHYyqr7hSUtmC3z8',
          height: 369,
          width: 369,
          mimeType: 'image/png',
          size: 23658,
        },
      },
    },
    { schema: challengeManager.getSchemaURL(challengeSchemaID) }
  );

  // Publish model to Ceramic node
  const challengeModel = await challengeManager.toPublished();
  const challengeListModel = await challengeListManager.toPublished();

  // Write published model to JSON file
  await writeFile(
    'src/datamodels/challenge/model.json',
    JSON.stringify(challengeModel)
  );
  await writeFile(
    'src/datamodels/challengesList/model.json',
    JSON.stringify(challengeListModel)
  );
})();
