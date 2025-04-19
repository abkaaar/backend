import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // ✅ default import
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const userVerification = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");



  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // Check if the user exists in the database
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = user; // Add user ID to req.user object

    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};

export default userVerification;
