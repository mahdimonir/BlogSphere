import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import swaggerUi from "swagger-ui-express";
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
  process.env.LOCAL_ORIGIN,
  process.env.PRODUCTION_ORIGIN,
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve Swagger UI static files
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "../node_modules/swagger-ui-dist"))
);

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
    res
      .status(500)
      .json({
        error: "Failed to load swagger-output.json",
        details: error.message,
      });
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
      console.log("Serving /api-docs");
      swaggerUi.serve(req, res, next);
    },
    swaggerUi.setup(swaggerDocument)
  );
} catch (error) {
  console.error("Error setting up Swagger UI:", error);
}

app.use(errorHandler);

export { app };
