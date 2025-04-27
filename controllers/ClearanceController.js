import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


  
// Create Clearance
export const createClearance = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized. User not found." });
      }
  
      const studentId = req.user.id;
  
      // Check if the student exists
      const student = await prisma.student.findUnique({
        where: { userId: studentId },
      });
  
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
  
      // Check if clearance already exists
      const existingClearance = await prisma.clearance.findFirst({
        where: { studentId: student.id },
      });
  
      if (existingClearance) {
        return res.status(400).json({ success: false, message: "Clearance request already exists" });
      }
  
      // Create the clearance
      const clearance = await prisma.clearance.create({
        data: {
          studentId: student.id,
        },
      });
  
      // Find all departments
      const departments = await prisma.department.findMany();
  
      // Create approvals for each department
      const approvals = departments.map((department) => ({
        clearanceId: clearance.id,
        departmentId: department.id,
        status: "PENDING",
        staffId: null, // No staff yet assigned
      }));
  
      await prisma.approval.createMany({
        data: approvals,
      });
  
      res.status(201).json({
        success: true,
        message: "Clearance request created successfully, approvals pending.",
        data: clearance,
      });
    } catch (error) {
      console.error("Error creating clearance:", error);
      next(error);
    }
  };
  

// Get all Clearances (Admin view)
export const getClearances = async (req, res) => {
  try {
    const clearances = await prisma.clearance.findMany({
      include: {
        student: {
          include: {
            user: true,
            department: true,
          },
        },
        approvals: true,
        payments: true,
      },
    });

    res.status(200).json({ success: true, data: clearances });
  } catch (error) {
    console.error("Error fetching clearances:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get a specific Clearance
export const getClearance = async (req, res) => {
  const { id } = req.params;

  try {
    const clearance = await prisma.clearance.findUnique({
      where: { id: id },
      include: {
        student: {
          include: {
            user: true,
            department: true,
          },
        },
        approvals: {
          include: {
            staff: true,
            department: true,
          },
        },
        payments: true,
      },
    });

    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance not found" });
    }

    res.status(200).json({ success: true, data: clearance });
  } catch (error) {
    console.error("Error fetching clearance:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
