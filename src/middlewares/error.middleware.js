export const errorHandler = (err, req, res, next) => {
  console.log("🔥 Error:", err);

  const statusCode = err.statusCode || 500;

  // Validation-style error
  if (Array.isArray(err.errors)) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Validation error",
      errors: err.errors
    });
  }

  // Fallback
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: []
  });
};
