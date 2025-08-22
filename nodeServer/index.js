import express from "express"; // Main Express framework
import dotenv from "dotenv"; // Loads .env variables
import cors from "cors"; // Allow cross-origin requests
import userAuthRoute from "../nodeServer/routes/authRoutes/userAuthRoute.mjs"


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

import { connectDB } from "./config/initDB.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running securely 🚀" });
});

app.get("*", (req, res) => {
  res
    .status(502)
    .send({ result: "Hey, you are looking for a page that doesn't exist!" });
});


app.use("/", userAuthRoute);

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
