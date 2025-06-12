import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes & Controllers
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// Models (optional for seeding, not directly used here)
import User from "./models/User.js";
import Post from "./models/Post.js";

// CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Serve static files
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Ensure public/assets directory exists (create it manually in your project root)

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // Local folder where files are saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filenames
  },
});
const upload = multer({ storage });

// Routes with file upload
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Other routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// DB + Server Start
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "SocialMedia",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB connection failed:", error));
