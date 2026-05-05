import { Router } from "express";
import { submitContactForm } from "../controllers/contact.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(submitContactForm));

export default router;
