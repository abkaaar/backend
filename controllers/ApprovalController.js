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

    // Check if the current user is a STAFF or SUPER_ADMIN
    if (currentUser.role !== "STAFF" && currentUser.role !== "SUPER_ADMIN") {
      return res.status(403).json({ success: false, message: "Only staff or admin can approve or reject." });
    }

    console.log("Approval ID:", approvalId); // This should log the ID passed in the URL

    // Find the approval by ID
    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
    });

    if (!approval) {
      return res.status(404).json({ success: false, message: "Approval not found." });
    }

    let staff = null;

    // If the user is STAFF, check department matching
    if (currentUser.role === "STAFF") {
      staff = await prisma.staff.findUnique({
        where: { userId: currentUser.id },
      });

      if (!staff) {
        return res.status(404).json({ success: false, message: "Staff not found." });
      }

      // Ensure the approval belongs to the staff's department
      if (approval.departmentId !== staff.departmentId) {
        return res.status(403).json({ success: false, message: "You can only approve/reject your department's requests." });
      }
    }

    // Update the approval status
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status, // 'APPROVED' or 'REJECTED'
        comment: comment || null, // If no comment, set it to null
        staffId: staff ? staff.id : null, // Only set staffId if staff is not null
        
      },
    });

    // Return success message with updated approval data
    return res.status(200).json({
      success: true,
      message: `Approval ${status.toLowerCase()} successfully.`,
      data: updatedApproval,
    });
  } catch (error) {
    console.error("Error updating approval:", error);
    next(error);
  }
};

