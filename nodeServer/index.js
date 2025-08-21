import express from "express"; // Main Express framework
import dotenv from "dotenv"; // Loads .env variables
import helmet from "helmet"; // Secure HTTP headers
import cors from "cors"; // Allow cross-origin requests
import compression from "compression"; // Gzip compress responses
import cookieParser from "cookie-parser"; // Parse cookies from incoming requests

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

import { connectDB } from "./config/initDB.js";
import { corsOptions } from "./config/cors.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running securely 🚀" });
});

app.get("*", (req, res) => {
  res
    .status(502)
    .send({ result: "Hey, you are looking for a page that doesn't exist!" });
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
