import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = join(rootDir, 'src/environments/environment.prod.ts');

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function escapeTsString(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

const environment = {
  production: true,
  remoteHost: readRequired('REMOTE_HOST'),
  encryptionKey: readRequired('ENCRYPTION_KEY'),
  stripePublicKey: readRequired('STRIPE_PUBLIC_KEY'),
  stripeActionType: process.env.STRIPE_ACTION_TYPE?.trim() || 'session',
};

const fileContents = `export const environment = {
  production: true,
  remoteHost: '${escapeTsString(environment.remoteHost)}',
  encryptionKey: '${escapeTsString(environment.encryptionKey)}',
  stripePublicKey: '${escapeTsString(environment.stripePublicKey)}',
  stripeActionType: '${escapeTsString(environment.stripeActionType)}',
};
`;

writeFileSync(outputPath, fileContents, 'utf8');
console.log(`Wrote production environment to ${outputPath}`);
