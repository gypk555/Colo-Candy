import {} from 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors";
import bodyParser from 'body-parser';
// import pgSession from "connect-pg-simple";
// import pool  from "./config/db.js"
import itemRoutes from "./routes/item.js";

const app = express();

// Middleware to parse JSON body
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Allow requests from colo-candy.onrender.com
  res.setHeader('Access-Control-Allow-Origin', 'https://colo-candy.onrender.com');
  // Allow common request methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Allow common request headers
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set credentials to true to support cookies
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Configure CORS to allow credentials
// app.use(cors({
//   origin: "http://192.168.1.28:3000", // Update to frontend URL if different
//   credentials: true, // Allow cookies
// }));

//const allowedOrigins = [
  //"http://localhost:3000",  // Allow local development
  // "http://192.168.104.11:3000", // Allow access from local network
//];

//app.use(cors({
  //origin: function (origin, callback) {
    //if (!origin || allowedOrigins.includes(origin)) {
      //callback(null, true);
    //} else {
      //callback(new Error("Not allowed by CORS"));
    //}
  //},
  //credentials: true,
//}));

// const PgSessionStore = pgSession(session);
// Configure session middleware
app.use(
  session({
    // store: new PgSessionStore({
    //   pool: pool, // PostgreSQL connection pool
    //   createTableIfMissing: true, // Automatically creates the user_sessions table
    //   tableName: "user_sessions", // Table to store sessions
    // }),
    secret: "process", // Change this to a strong secret
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
//const PORT =10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
