import { Router } from "express";
import { recommendQuote } from "../controllers/quote.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.post("/recommend", asyncHandler(recommendQuote));

export default router;
