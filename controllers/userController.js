import dotenv from "dotenv";
dotenv.config(); 

import { PrismaClient } from "@prisma/client";
import { createSecretToken } from "../utils/SecretToken.js";
import pkg from 'bcryptjs';
let { hash, compare } = pkg;
import sendVerificationMail from "../utils/sendVerificationCode.js";
import { randomInt } from "crypto";
import jwt from 'jsonwebtoken';
const { sign } = jwt;


// Initialize Prisma Client
const prisma = new PrismaClient();

// Signup
export const Signup = async (req, res, next) => {
  const { email, password, createdAt } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        createdAt,
      },
    });

    // Create token
    const token = createSecretToken(user.id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      message: "User Registered successfully",
      success: true,
      email,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const Login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and password",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials, user not found" });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials, password does not match" });
    }

    // Generate a 6-digit verification code
    const verificationCode = randomInt(100000, 999999).toString();

    // Store the code temporarily (in DB or cache)
    await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        verificationCodeExpire: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 mins
      },
    });

    // Send the verification code via email
    await sendVerificationMail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please verify to continue.",
    });
  } catch (error) {
    next(error);
  }
};

// Verify the code and log the user in
export const verifyCode = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.verificationCode !== verificationCode) {
      return res.status(401).json({ success: false, message: "Invalid or expired verification code" });
    }

    // Clear the verification code after successful verification
    await prisma.user.update({
      where: { email },
      data: { verificationCode: null },
    });

    const token = sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// Update user data
export const updateUser = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have user info from JWT middleware
  const updatedData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }


    // If the address was updated, reflect the change in the Space model
    if (updatedData.address) {
      g("Updating spaces with new address:", updatedData.address);

      await prisma.space.updateMany({
        where: { address: updatedUser.address }, // Find spaces linked to this user's address
        data: { address: updatedData.address }, // Update with new address
      });
    }

    res.status(200).json({ user: updatedUser, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Get user details
export const getUser = async (req, res) => {
  const userId = req.user.id; // Assuming you extract the user ID from auth middleware

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
