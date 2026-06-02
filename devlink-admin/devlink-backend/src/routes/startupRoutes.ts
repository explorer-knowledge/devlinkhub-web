import { Router } from "express";
import { getStartups, createStartup } from "../controllers/startupController.js";

const router = Router();

router.get("/", getStartups);
router.post("/", createStartup);

export default router;
