import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { errorHandler } from "./middleware/errorHandler.js";
import { upload } from "./middleware/multerMiddleware.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000", // Local Next.js frontend
  "https://your-frontend-vercel-app.vercel.app", // Replace with your production frontend URL
];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // Allow requests from allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, origin); // Reflect the requesting origin
      } else {
        callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    // Ensure preflight requests are cached for 24 hours
    maxAge: 86400,
  })
);

// Handle OPTIONS preflight requests explicitly
app.options("*", cors()); // Respond to all OPTIONS requests

// Serve Swagger UI static files
app.use("/swagger-ui", express.static(path.join(__dirname, "../node_modules/swagger-ui-dist")));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    upload(req, res, next);
  } else {
    next();
  }
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

app.get("/", (req, res) => {
  res.send("Hello from Express server with mahdi!!");
});

// Debug route for swagger-output.json
app.get("/debug-swagger-json", async (req, res) => {
  try {
    const swaggerDocument = JSON.parse(
      await fs.readFile(path.join(__dirname, "swagger-output.json"), "utf-8")
    );
    res.json(swaggerDocument);
  } catch (error) {
    res.status(500).json({ error: "Failed to load swagger-output.json", details: error.message });
  }
});

try {
  const swaggerDocument = JSON.parse(
    await fs.readFile(path.join(__dirname, "swagger-output.json"), "utf-8")
  );
  console.log("Swagger document loaded:", Object.keys(swaggerDocument));
  app.use(
    "/api-docs",
    (req, res, next) => {
      console.log(`Serving /api-docs from origin: ${req.get("origin")}`);
      swaggerUi.serve(req, res, next);
    },
    swaggerUi.setup(swaggerDocument)
  );
} catch (error) {
  console.error("Error setting up Swagger UI:", error);
}

app.use(errorHandler);

export { app };
