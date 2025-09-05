import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from './routes/auth.routes.js';
import userRouter from "./routes/user.Routes.js";

const app = express();
const port = process.env.PORT || 5000;

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


// API Endpoints
app.get('/', (req, res) => res.send("API Working"));


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});


