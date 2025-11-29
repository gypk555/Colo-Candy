import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors";
import mongoose from 'mongoose';
// import pgSession from "connect-pg-simple";
import pool from "./config/db.js";
import itemRoutes from "./routes/item.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Test database connection
try {
  await pool.query('SELECT NOW()');
  console.log('Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);
}
// MongoDB Connection (for user profile features)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/colo-candy')
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.error('⚠️  MongoDB Connection Note:', err.message);
    console.log('    Continuing with PostgreSQL for existing features');
  });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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


// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'Server running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API Routes
app.use("/api", itemRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
