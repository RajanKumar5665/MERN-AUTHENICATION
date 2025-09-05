import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from './routes/auth.routes.js';
import userRouter from "./routes/user.Routes.js";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

// Connect to the database
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
]

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});


