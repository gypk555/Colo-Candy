import {} from 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Explicitly load .env file

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, // ✅ Use from .env
  port: process.env.DB_PORT,
});


export default pool;
