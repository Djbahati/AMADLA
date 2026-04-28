import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { exportRevenuePdf, exportUsageCsv } from "../controllers/report.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();
router.use(authenticate, authorize("ADMIN", "OPERATOR"));

router.get("/usage.csv", asyncHandler(exportUsageCsv));
router.get("/revenue.pdf", asyncHandler(exportRevenuePdf));

export default router;
