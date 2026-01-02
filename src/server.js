import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// ROUTES (make sure these imports exist)
import authRoutes from "./routes/auth.routes.js";
// import other routes here...

const PORT = process.env.PORT || 5000;

// create folders safely (Render-safe)
fs.mkdirSync("uploads/users", { recursive: true });
fs.mkdirSync("uploads/patients", { recursive: true });
fs.mkdirSync("uploads/appointments", { recursive: true });

const app = express();

// middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// static files
app.use("/uploads/users", express.static(path.join(process.cwd(), "uploads/users")));
app.use("/uploads/patients", express.static(path.join(process.cwd(), "uploads/patients")));
app.use("/uploads/appointments", express.static(path.join(process.cwd(), "uploads/appointments")));

// routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
// app.use("/api/doctors", doctorRoutes); // add others back later

app.use(errorHandler);

// start server
const start = async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(PORT, () => logger.info(`🚀 Server running at port ${PORT}`));
};

start();
