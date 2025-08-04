import { configDotenv } from 'dotenv';
import { Client } from 'pg';
import { v4 as uuid } from 'uuid';

import { exec } from 'child_process';
import { join } from 'path';
import { URL } from 'url';
import { promisify } from 'util';

configDotenv();

const execSync = promisify(exec);

const generateDatabaseURL = (schema: string) => {
  const dbUser = process.env.POSTGRES_USER;
  const dbPass = process.env.POSTGRES_PASSWORD;
  const dbHost = process.env.POSTGRES_HOST;
  const dbPort = process.env.POSTGRES_PORT;
  const dbName = process.env.POSTGRES_DB;

  const url = new URL(`postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${schema}`);

  return url.toString();
};

export async function setupPostgresSchema() {
  const schemaId = `test_${uuid()}`;
  const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');

  const url = generateDatabaseURL(schemaId);

  global.schema = schemaId;
  global.connectionString = url;

  process.env.POSTGRES_URL = url;
  global.process.env.POSTGRES_URL = url;

  console.info(`Running prisma db push (${schemaId}...`);

  await execSync(`${prismaBinary} db push --skip-generate`, {
    env: {
      ...process.env,
      POSTGRES_URL: url,
    },
  });
}

export async function teardownPostgresSchema() {
  const client = new Client({
    connectionString: global.connectionString,
  });

  console.info(`Dropping schema (${global.schema})...`);

  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${global.schema}" CASCADE`);
  await client.end();
}
