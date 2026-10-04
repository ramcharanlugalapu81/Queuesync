import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

const databaseName = process.env.DB_NAME || 'campus_queue_manager';
if (databaseName !== 'campus_queue_manager') {
  throw new Error('database/schema.sql initializes campus_queue_manager; set DB_NAME to campus_queue_manager.');
}

const missingSettings = ['DB_HOST', 'DB_USER'].filter((name) => !process.env[name]);
if (missingSettings.length) {
  throw new Error(`Set ${missingSettings.join(' and ')} in .env before setting up MySQL.`);
}

const schema = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

try {
  await connection.query(schema);
  console.log(`Database ${databaseName} is ready with the initial service desks.`);
} finally {
  await connection.end();
}
