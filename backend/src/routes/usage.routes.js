import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { listUsage, recordUsage } from "../controllers/usage.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(listUsage));
router.post("/", authorize("ADMIN", "OPERATOR"), asyncHandler(recordUsage));

export default router;
