const ErrorResponse = require("../utils/errorResponse");

module.exports.errorHandler = (err, req, res, next) => {
  let error = err;

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Duplicate Field value entered or this company/user already exist`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // / Handle invalid MongoDB IDs
  if (err.name === "CastError") {
    const message = `Resource not found with ID ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Handle JSON Web Token errors
  // if (err.name === "JsonWebTokenError") {
  //   const message = "Invalid token, please log in again";
  //   error = new ErrorResponse(message, 401);
  // }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    const message = err.name === "TokenExpiredError"
      ? "Token expired, please log in again"
      : "Invalid token, please log in again";
    error = new ErrorResponse(message, 401);
  }
  // 
  console.error({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
    name: error.name,
  });

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(req.app.get("env") === "development" && { stack: error.stack }) // Stack trace only in development
  });
};

// middleware asyncHandler
module.exports.asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
