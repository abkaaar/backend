import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // ✅ default import
const { verify } = jwt;
import ErrorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "./error.js";

dotenv.config();

const prisma = new PrismaClient();

const userVerification = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(
      new ErrorResponse(
        "Authentication token is missing or not authorized",
        401
      )
    );
  }

  const decoded = verify(token, process.env.TOKEN_KEY);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  req.user = user;
  next(); // Proceed to the next middleware/route
});

export default userVerification;