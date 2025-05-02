import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// export const addStudent = async (req, res) => {
//   try {
//     const adminUser = req.user; // Get user from request object
//     // Check if user is authenticated
//     if (!adminUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not authenticated" });
//     }

//     const { email, phoneNumber, matricNo, departmentName, name } = req.body;

//     // Check if user or student already exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     const existingStudent = await prisma.student.findUnique({
//       where: { matricNo },
//     });

//     if (existingUser || existingStudent) {
//       return res.status(400).json({
//         success: false,
//         message: "Student with this email or matric number already exists",
//       });
//     }

//     // Create user with a random password (or hashed matric number)
//     // const hashedPassword = await bcrypt.hash(matricNo, 10);
//     const hashedPassword = "11223344"; // Use a default password for now

//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         role: "STUDENT",
//       },
//     });

//     // Create student and link to user
//     const student = await prisma.student.create({
//       data: {
//         userId: user.id,
//         matricNo,
//         name,
//         phoneNumber,
//         departmentName,
//       },
//       include: {
//         user: true,
//         department: true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Student added successfully",
//       data: student,
//       // data: {
//       //   id: student.id,
//       //   name: student.name,
//       //   matricNo: student.matricNo,
//       //   department: student.department.name,
//       //   email: student.user.email,
//       // },
//     });
//   } catch (error) {
//     console.error("Error adding student:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

export const addStudents = async (req, res) => {
  try {
    const adminUser = req.user; // Get user from request object
    // Check if user is authenticated
    if (!adminUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const studentsData = req.body; // Assume studentsData is an array of student objects

    // Validate the incoming data
    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide an array of student objects.",
      });
    }

    // Create an array of operations to perform in a single transaction
    const operations = studentsData.map((student) => {
      const { email, phoneNumber, matricNo, departmentName, name } = student;

      return prisma.user.create({
        data: {
          email,
          password: "11223344", // Default password
          role: "STUDENT",
        },
      }).then((user) => {
        return prisma.student.create({
          data: {
            userId: user.id,
            matricNo,
            name,
            phoneNumber,
            departmentName,
          },
        });
      });
    });

    // Perform all the operations in a single transaction
    const result = await prisma.$transaction(operations);

    res.status(201).json({
      success: true,
      message: "Students added successfully",
      data: result, // Array of created students
    });
  } catch (error) {
    console.error("Error adding students:", error);
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
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
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
  try {
    const user = req.user; // Get user from request object
    // Check if user is authenticated
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const { id } = req.params;

    const { name, email, phoneNumber, matricNo, departmentId } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
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
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update student. Please try again later",
        error,
      });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const user = req.user; // Get user from request object
    // Check if user is authenticated
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
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
