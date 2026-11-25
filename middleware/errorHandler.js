// Handle Not Found Routes
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

// Central Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode >= 400
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

module.exports = {
  notFound,
  errorHandler
};