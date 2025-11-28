import 'dotenv/config';
import pkg from "pg";

const { Pool } = pkg;

// Check for the DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error('Error: Missing required environment variable: DATABASE_URL');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;


// Previous MongoDB connection code (commented out)

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@colo-candy.2c3m5a3.mongodb.net/?appName=Colo-Candy`

// const connectDB = async () => {
//   try {
//     await mongoose.connect(URI);
//     console.log("MongoDB Connected Successfully (Mongoose)")
//   } catch (err) {
//     console.error("MongoDB Connection Error:", err);
//     process.exit(1);
//   }
// };

// export default connectDB;