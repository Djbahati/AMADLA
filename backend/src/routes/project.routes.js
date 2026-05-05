import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { assignUserToProject, createProject, listProjects, listProjectsPublic } from "../controllers/project.controller.js";
import { asyncHandler } from "../helpers/asyncHandler.js";

const router = Router();

router.get("/public", asyncHandler(listProjectsPublic));
router.use(authenticate);
router.get("/", asyncHandler(listProjects));
router.post("/", authorize("ADMIN", "OPERATOR"), asyncHandler(createProject));
router.post("/:projectId/assign", authorize("ADMIN", "OPERATOR"), asyncHandler(assignUserToProject));

export default router;
