import { asyncHandler } from "../middlewares/error";
import prisma from "../prismaClient"; // Assuming you have a Prisma client setup

// Add Department
export const addDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user_id = req.user._id;

  // Use Prisma to create a new department
  const department = await prisma.department.create({
    data: {
      name,
      user_id,
      createdBy: req.user.id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Department added successfully",
    data: department,
  });
});

// Get all departments
export const getAllDepartments = asyncHandler(async (req, res) => {
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
});

// Get a department
export const getDepartment = asyncHandler(async (req, res) => {
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
});

// Update a department
export const updateDepartment = asyncHandler(async (req, res) => {
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
});

// Delete a department
export const deleteDepartment = asyncHandler(async (req, res) => {
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
});

// Search departments 
export const searchDepartments = asyncHandler(async (req, res) => {
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
});