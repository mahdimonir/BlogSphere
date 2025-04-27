import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Generic fallback for unknown errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || "Internal Server Error",
    errors: [],
  });
};

export { errorHandler };
