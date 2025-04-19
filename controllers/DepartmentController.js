import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addDepartment = async (req, res) => {
  try {
    const user = req.user; // Get user from request object
    // Check if user is authenticated
    if (!user) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }
    
    const { name } = req.body;
    // const user_id = req.user;

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    res.status(200).json({
      success: true,
      message: "Department added successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        user_id: req.user._id,
      },
    });

    if (departments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No departments found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a department
export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to find a department by ID
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Use Prisma to update a department
    const department = await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to delete a department
    await prisma.department.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Search departments
export const searchDepartments = async (req, res) => {
  try {
    const { name } = req.query;

    // Use Prisma to search for departments by name
    const departments = await prisma.department.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    if (departments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No departments found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
