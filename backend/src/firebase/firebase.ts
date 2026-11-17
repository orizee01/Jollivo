import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import serviceAcctCert from './serviceAcct.ts';
import Env from '../shared/utils/env.ts';
import { generateKeyPairSync } from 'node:crypto';

// Generate a valid RSA key pair for mock/test environments
const createMockServiceAccount = () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return {
    project_id: 'mock-project-id',
    private_key: privateKey,
    client_email: 'mock-client-email@mock-project.iam.gserviceaccount.com'
  };
};

const initializeFirebase = () => {
  const nodeEnv = Env.get<string>('NODE_ENV');
  const hasValidCredentials =
    serviceAcctCert.project_id && serviceAcctCert.private_key && serviceAcctCert.client_email;

  if (nodeEnv === 'test' || !hasValidCredentials) {
    admin.initializeApp({
      credential: admin.credential.cert(createMockServiceAccount() as ServiceAccount)
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAcctCert as ServiceAccount)
    });
  }
};

initializeFirebase();

export { admin };
