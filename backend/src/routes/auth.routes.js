import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { login, me, register } from "../controllers/auth.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));

export default router;
