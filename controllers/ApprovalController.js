import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all approvals
export const getApprovals = async (req, res, next) => {
  try {
    const currentUser = req.user;

    console.log("user", currentUser);

    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (currentUser.role === "SUPER_ADMIN") {
      // If Super Admin: get all approvals
      const approvals = await prisma.approval.findMany({
        include: {
          clearance: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
          department: true,
        },
      });

      return res.status(200).json({ success: true, data: approvals });
    }

    if (currentUser.role === "STAFF") {
      // If Staff: get only approvals in their department
      const staff = await prisma.staff.findUnique({
        where: { userId: currentUser.id },
      });

      if (!staff) {
        return res.status(404).json({ success: false, message: "Staff not found" });
      }

      const approvals = await prisma.approval.findMany({
        where: { departmentId: staff.departmentId },
        include: {
          clearance: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
          department: true,
        },
      });

      return res.status(200).json({ success: true, data: approvals });
    }

    // Default if user is neither SUPERADMIN nor STAFF
    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch (error) {
    console.error("Error getting approvals:", error);
    next(error);
  }
};

// Update (Approve or Reject) an Approval
export const updateApprovalStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { approvalId } = req.params;
    const { status, comment } = req.body; // status should be either 'APPROVED' or 'REJECTED'

    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (currentUser.role !== "STAFF") {
      return res.status(403).json({ success: false, message: "Only staff can approve or reject." });
    }

    const staff = await prisma.staff.findUnique({
      where: { userId: currentUser.id },
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found." });
    }

    // Find the approval
    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
    });

    if (!approval) {
      return res.status(404).json({ success: false, message: "Approval not found." });
    }

    // Check if the approval belongs to staff's department
    if (approval.departmentId !== staff.departmentId) {
      return res.status(403).json({ success: false, message: "You can only approve/reject your department's requests." });
    }

    // Update the approval
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: status,   // 'APPROVED' or 'REJECTED'
        comment: comment || null,
        staffId: staff.id,
      },
    });

    return res.status(200).json({ success: true, message: `Approval ${status.toLowerCase()} successfully.`, data: updatedApproval });
  } catch (error) {
    console.error("Error updating approval:", error);
    next(error);
  }
};
