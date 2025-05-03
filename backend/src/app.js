import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";

// Load Swagger JSON manually
const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger-output.json", import.meta.url))
);

// Import routes
import authRouter from "./routes/authRoutes.js";
import { errorHandler } from "./utils/errorHandler/errorHandler.js";

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// API Routes
app.use("/api/v1/users", authRouter);

// Default Route
app.get("/", (req, res) => {
  res.send("Hello from Express server with mahdi!!");
});

// Auth Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error-handler
app.use(errorHandler);

export { app };
