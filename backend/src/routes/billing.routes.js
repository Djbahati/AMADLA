import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { generateBill, listBills, payBill, paymentHistory } from "../controllers/billing.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/bills", asyncHandler(listBills));
router.post("/bills", authorize("ADMIN", "OPERATOR"), asyncHandler(generateBill));
router.post("/payments", asyncHandler(payBill));
router.get("/payments", asyncHandler(paymentHistory));

export default router;
