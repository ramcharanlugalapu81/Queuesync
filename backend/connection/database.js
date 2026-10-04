import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool;

export function getPool() {
  if (!pool) {
    if (!env.database.host || !env.database.user) {
      throw new Error('MySQL settings are missing. Fill in DB_HOST and DB_USER in .env.');
    }
    pool = mysql.createPool({
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: env.database.name,
      waitForConnections: true,
      connectionLimit: 10,
      decimalNumbers: true,
    });
  }
  return pool;
}

export async function checkDatabase() {
  const connection = await getPool().getConnection();
  await connection.ping();
  connection.release();
}
