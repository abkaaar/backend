import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Clearance
export const createClearance = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized. User not found." });
      }
  
      const studentId = req.user.id; // Assuming req.user contains student details
  
      // Make sure student exists
      const student = await prisma.student.findUnique({
        where: { userId: studentId },
      });
  
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
  
      // Create clearance for the student
      const clearance = await prisma.clearance.create({
        data: {
          studentId: student.id,
        },
      });
  
      res.status(201).json({
        success: true,
        message: "Clearance request created successfully",
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
