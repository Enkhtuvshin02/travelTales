import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import pkg from "body-parser";
const { json, urlencoded } = pkg;
import cors from "cors";
import storyRoutes from "./routes/storyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";

const app = express();
connectDB();

app.use(express.json());
app.use(urlencoded({ extended: true }));

// Route handlers
app.use("/api/story", storyRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/type", typeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Serve static files
app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
