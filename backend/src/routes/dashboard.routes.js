import { Router } from "express";
import { getAdminSummary } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.get("/summary", authenticate, authorize("ADMIN", "OPERATOR"), asyncHandler(getAdminSummary));
router.get("/", authenticate, authorize("ADMIN", "OPERATOR"), asyncHandler(getAdminSummary));

export default router;
