import express from "express";
const router = express.Router();

import { createClearance, getClearance, getClearances } from "../controllers/ClearanceController.js";
import userVerification from "../middlewares/AuthMiddleware.js";


router.post("/request", userVerification, createClearance); // Students request clearance
router.get("/all", getClearances); // Admins view all clearances
router.get("/:id", getClearance); // Get one clearance

export default router;
