import { Router } from "express";
import {
  getInquiries, getInquiryById, createInquiry,
  updateInquiryStatus, replyToInquiry, deleteInquiry,
} from "../controllers/inquiryController.js";

const router = Router();

router.get("/", getInquiries);
router.get("/:id", getInquiryById);
router.post("/", createInquiry);
router.put("/:id/status", updateInquiryStatus);
router.post("/:id/reply", replyToInquiry);
router.delete("/:id", deleteInquiry);

export default router;
