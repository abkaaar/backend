import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export const addStaff = async (req, res) => {
  try {
    const adminStaff = req.user; // Get user from request object
    // Check if user is authenticated
    if (!adminStaff) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const { email, departmentName, name } = req.body;

    // Check if user or staff already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if(existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create user with a random password (or hashed matric number)
    const hashedPassword = await bcrypt.hash(email, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STAFF",
      },
    });

    // Create staff and link to user
    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        name,
        departmentName,
      },
      include: {
        user: true,
        department: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Staff added successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getStaffs = async (req, res) => {
  try {
    const staffs = await prisma.staff.findMany({
      include: {
        user: true,
        department: true,
      },
    });

    res.status(200).json({
      success: true,
      data: staffs,
    });
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: true,
        department: true,
      },
    });

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ success: false, message: "Server error" , error });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const user = req.user; // Get user from request object
    // Check if user is authenticated
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const { id } = req.params;

    const { name, email, departmentName } = req.body;

    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "staff not found" });
    }

    // Update user and staff details
    const updatedUser = await prisma.user.update({
      where: { id: staff.userId },
      data: { email },
    });

    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        departmentName,
      },
    });

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: {updatedStaff, updatedUser}
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update staff. Please try again later",
        error,
      });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const user = req.user; // Get user from request object
    // Check if user is authenticated
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    // Delete staff and user
    await prisma.staff.delete({
      where: { id: parseInt(id, 10) },
    });

    await prisma.user.delete({
      where: { id: staff.userId },
    });

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
