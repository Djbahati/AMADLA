import { Router } from "express";
import { getAdminSummary } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, authorize("ADMIN", "OPERATOR"), getAdminSummary);

export default router;
