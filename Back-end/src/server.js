import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors";
import os from 'os';
// import pgSession from "connect-pg-simple";
import pool from "./config/db.js";
import itemRoutes from "./routes/item.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Test database connection
try {
  await pool.query('SELECT NOW()');
  console.log('✅ PostgreSQL Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Configure CORS to allow credentials
// Get local IP for phone access
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const localIP = getLocalIP();
const allowedOrigins = [
  "http://localhost:3000",
  `http://${localIP}:3000`,
  `http://127.0.0.1:3000`,
  "https://colo-candy.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
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
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📱 Access from phone: http://${localIP}:${PORT}`);
  console.log(`🖥️  Access from laptop: http://localhost:${PORT}\n`);
});
