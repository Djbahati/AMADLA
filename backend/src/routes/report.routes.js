import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { exportRevenuePdf, exportUsageCsv } from "../controllers/report.controller.js";

const router = Router();
router.use(authenticate, authorize("ADMIN", "OPERATOR"));

router.get("/usage.csv", exportUsageCsv);
router.get("/revenue.pdf", exportRevenuePdf);

export default router;
