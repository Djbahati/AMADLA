import { Router } from "express";
import { listAlerts, resolveAlert } from "../controllers/alert.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", listAlerts);
router.patch("/:id/resolve", authorize("ADMIN", "OPERATOR"), resolveAlert);

export default router;
