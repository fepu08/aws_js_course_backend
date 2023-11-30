import { Client, ClientConfig } from 'pg';
import { promises as fsPromises } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';

function getConfig() {
  const config: ClientConfig = {
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    ssl: { rejectUnauthorized: false },
  };

  for (const field in config) {
    if (!field) throw new Error('Missing Env Var');
  }
  return config;
}
async function runSqlScript(filePath: string, client: Client) {
  const script = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
  const statements = script
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(';'); // split into all statements

  console.log('\n' + statements);
  console.log('#######\n');

  for (const statement of statements) {
    console.log('\n' + statement);
    console.log('----------------------\n');
    await client.query(statement);
  }

  console.log(`Executed script: ${filePath}`);
}

async function main() {
  // Database configuration
  const config = getConfig();

  const client = new Client(config);

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected');

    // Paths to your SQL scripts
    const createEnumsScriptPath = resolve(__dirname, './create-enums.sql');
    const createTablesScriptPath = resolve(__dirname, './create-tables.sql');
    const populateDbScriptPath = resolve(__dirname, './populate-db.sql');

    await runSqlScript(createEnumsScriptPath, client);
    await runSqlScript(createTablesScriptPath, client);
    await runSqlScript(populateDbScriptPath, client);
    console.log('Success');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.end();
  }
}

main();
