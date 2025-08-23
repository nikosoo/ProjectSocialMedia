import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import upload from "./middleware/upload.js"; // ✅ use your upload.js
import User from "./models/User.js"; // ✅ import User

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

const allowedOrigins = [
  "https://project-social-media-five.vercel.app", // deployed frontend
  "http://localhost:3000", // local dev
  "http://localhost:5173", // Vite dev
];

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH" ],
    credentials: true,
  })
);

/* ROUTES WITH FILE UPLOADS */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// ✅ Get user profile picture
app.get("/users/:id/picture", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.picture) return res.status(404).send("No picture found");

    res.set("Content-Type", user.picture.contentType);
    res.send(user.picture.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "SocialMedia",
  })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on Port: ${PORT}`));
  })
  .catch((error) => console.error(`❌ MongoDB connection failed: ${error}`));
