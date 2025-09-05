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

const allowedOrigins = ['http://localhost:5173']

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


// Handle graceful shutdown and port conflicts
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Trying a different port...`);
    setTimeout(() => {
      server.close();
      app.listen(port + 1, () => {
        console.log(`Server started on PORT:${port + 1}`);
      });
    }, 1000);
  } else {
    console.error('Server error:', err);
  }
});
