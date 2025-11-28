import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors";
// import pgSession from "connect-pg-simple";
import pool from "./config/db.js";
import itemRoutes from "./routes/item.js";

// Test database connection
try {
  await pool.query('SELECT NOW()');
  console.log('Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);
}
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow credentials
app.use(cors({
  origin: ["http://localhost:3000", "https://colo-candy.onrender.com"], // Allow both local and deployed frontend
  credentials: true,
}));

// const PgSessionStore = pgSession(session);
// Configure session middleware
app.use(
  session({
    // store: new PgSessionStore({
    //   pool: pool, // PostgreSQL connection pool
    //   createTableIfMissing: true, // Automatically creates the user_sessions table
    //   tableName: "user_sessions", // Table to store sessions
    // }),
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production", // Use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent client-side access
      secure: false, // Set true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
    },
  })
);


app.use("/api", itemRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
