import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert { type: "json" };

import { errorHandler } from "./middleware/errorHandler.js";
import { upload } from "./middleware/multerMiddleware.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Apply Multer for multipart/form-data requests
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

// Load and serve Swagger UI
try {
  const swaggerDocument = JSON.parse(
    await fs.readFile(path.join(__dirname, "swagger-output.json"), "utf-8")
  );
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error("Error loading Swagger UI:", error);
}

app.use(errorHandler);

export { app };
