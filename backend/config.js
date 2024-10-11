import MongoDBStore from 'connect-mongodb-session';
import cors from "cors";
import env from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

const production = process.env.NODE_ENV === "production";
env.config();

//create app and server
const app = express();
const server = http.createServer(app);

//parse posts
app.use(express.json());

//cors
const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true
};
const io = new Server(server, {
  cors: corsOptions,
});
app.use(cors(corsOptions));

//session store
const store = new MongoDBStore(session)({
  uri: process.env.DB_URL,
  databaseName: "chat-db",
  collection: 'mySessions'
});

//session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "session-secret",
  resave: true,
  saveUninitialized: true,
  proxy: true,
  store: store,
  cookie: {
    secure: production,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,//1 month
    httpOnly: true,
  }
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

// Define rate limit rules
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 10,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

export { app, io, server };
