import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { generateBill, listBills, payBill, paymentHistory } from "../controllers/billing.controller.js";

const router = Router();
router.use(authenticate);

router.get("/bills", listBills);
router.post("/bills", authorize("ADMIN", "OPERATOR"), generateBill);
router.post("/payments", payBill);
router.get("/payments", paymentHistory);

export default router;
