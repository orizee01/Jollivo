import Env from '../shared/utils/env.ts';

/**
 * Firebase service account, read from environment variables so the secret key
 * is never committed. Get the values from Firebase console > Project settings >
 * Service accounts > Generate new private key.
 */
const serviceAcctCert = {
  type: 'service_account',
  project_id: Env.get<string>('FIREBASE_PROJECT_ID'),
  // .env files store the key on one line with literal "\n"; turn those back into line breaks.
  private_key: Env.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
  client_email: Env.get<string>('FIREBASE_CLIENT_EMAIL')
};

export default serviceAcctCert;
