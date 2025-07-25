import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(
  cors({
    origin(requestOrigin, callback) {
      const allowedOrigins = ["http://localhost:3000"];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!requestOrigin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Request origin is not allowed"));
      }
    },
  })
);
app.use(express.json());

// ✅ Basic root route (for browser testing)
app.get("/", (_, res) => {
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
