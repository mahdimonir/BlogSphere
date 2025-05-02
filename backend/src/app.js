import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middleware/errorHandler.js";
import { upload } from "./middleware/multerMiddleware.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

(async () => {
  const swaggerDocument = await import("./swagger-output.json", { assert: { type: "json" } });

  const app = express();

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
  app.use("/api/v1/comments", commentRouter); // Fixed typo
  app.use("/api/v1/likes", likeRouter);

  app.get("/", (req, res) => {
    res.send("Hello from Express server with mahdi!!");
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument.default || swaggerDocument));

  app.use(errorHandler);

  
  export { app };
})();
