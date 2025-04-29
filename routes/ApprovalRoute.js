import express from "express";
const router = express.Router();

import userVerification from "../middlewares/AuthMiddleware.js";
import { getApprovals, updateApprovalStatus } from "../controllers/ApprovalController.js";


router.get("/all", userVerification, getApprovals); // Get all approvals 
router.patch("/:approvalId", userVerification, updateApprovalStatus ); // Approve or reject a clearance

export default router;
