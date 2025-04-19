import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const addStudent = async (req, res) => {
  const { email, phoneNumber, matricNo, departmentId } = req.body;

  try {
    // Check if user or student already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingStudent = await prisma.student.findUnique({ where: { matricNo } });

    if (existingUser || existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or matric number already exists",
      });
    }

    // Create user with a random password (or hashed matric number)
    const hashedPassword = await bcrypt.hash(matricNo, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // Create student and link to user
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        matricNo,
        phoneNumber,
        departmentId,
      },
      include: {
        user: true,
        department: true,
      }
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: {
        id: student.id,
        matricNo: student.matricNo,
        department: student.department.name,
        email: student.user.email,
      },
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        department: true,
      },
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        department: true,
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, matricNo, departmentId } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Update user and student details
    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: { email },
    });

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phoneNumber,
        matricNo,
        departmentId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Delete student and user
    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

    await prisma.user.delete({
      where: { id: student.userId },
    });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

