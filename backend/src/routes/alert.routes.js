import { Router } from "express";
import { listAlerts, resolveAlert } from "../controllers/alert.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(listAlerts));
router.patch("/:id/resolve", authorize("ADMIN", "OPERATOR"), asyncHandler(resolveAlert));

export default router;
