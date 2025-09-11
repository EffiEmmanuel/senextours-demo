import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(process.env.PGSQL_PORT as string, 10),
  database: process.env.PGSQL_DATABASE,
  ssl:
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? {
          rejectUnauthorized: false,
        }
      : process.env.PGSQL_CA_CRT
        ? {
            ca: process.env.PGSQL_CA_CRT,
          }
        : undefined,
});
