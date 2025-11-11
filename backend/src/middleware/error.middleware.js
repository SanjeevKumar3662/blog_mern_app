import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  // Log the error details (only in development)
  if (process.env.NODE_ENV !== "PROD") {
    console.error("Error caught by middleware:", err);
  }

  // If the error was thrown using ApiError (custom app error)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success, // always false
      message: err.message,
      errors: err.errors || [], // detailed validation info, if any
      data: err.data, // null by default
    });
  }

  // For all other unexpected errors (system, syntax, etc.)
  const statusCode = err.statusCode || 500;
  const message =
    err.message && typeof err.message === "string"
      ? err.message
      : "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: [],
    data: null,
  });
};
