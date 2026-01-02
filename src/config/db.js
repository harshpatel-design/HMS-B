import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async (mongoUrl) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUrl, {
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
