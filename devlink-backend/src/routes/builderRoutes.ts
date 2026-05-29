import { Router } from "express";
import { getBuilders } from "../controllers/builderController.js";

const router = Router();

router.get("/", getBuilders);

export default router;
