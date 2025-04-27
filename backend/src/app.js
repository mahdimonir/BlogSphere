// Import dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert { type: "json" };

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

// Export the app
export { app };
