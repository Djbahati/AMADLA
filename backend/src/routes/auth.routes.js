import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { login, me, register } from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../middleware/refreshToken.js";
import { logout } from "../middleware/logout.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refreshAccessToken));
router.post("/logout", authenticate, asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(me));

export default router;
