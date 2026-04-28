import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { listUsage, recordUsage } from "../controllers/usage.controller.js";

const router = Router();
router.use(authenticate);

router.get("/", listUsage);
router.post("/", authorize("ADMIN", "OPERATOR"), recordUsage);

export default router;
