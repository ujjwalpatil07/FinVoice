import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const dbUrl = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Not Connected, Error: ${error?.message}`);
    process.exit(1);
  }
};
