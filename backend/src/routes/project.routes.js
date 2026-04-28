import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { assignUserToProject, createProject, listProjects } from "../controllers/project.controller.js";

const router = Router();

router.use(authenticate);
router.get("/", listProjects);
router.post("/", authorize("ADMIN", "OPERATOR"), createProject);
router.post("/:projectId/assign", authorize("ADMIN", "OPERATOR"), assignUserToProject);

export default router;
