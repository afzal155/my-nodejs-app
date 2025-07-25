import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import { corsOptions } from "./config/cors.config";

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Basic root route (for browser testing)
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Mongo error:", err));
