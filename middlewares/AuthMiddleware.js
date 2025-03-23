const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const { asyncHandler } = require("./error");

module.exports.userVerification = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(
      new ErrorResponse(
        "Authentication token is missing or not authorized",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  req.user = user;
  next(); // Proceed to the next middleware/route
});

// Role Verification Middleware for 'Host'
module.exports.isHost = (req, res, next) => {
  console.log(req.user.host);
  if (req.user.role !== "host") {
    return next(new ErrorResponse("Access denied. Host role required.", 403));
  }
  next(); // Proceed to next middleware/route
};
