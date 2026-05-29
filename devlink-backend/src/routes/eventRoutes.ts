import { Router } from "express";
import {
  getEvents, getEventById, createEvent,
  updateEvent, deleteEvent, rsvpEvent,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/rsvp", rsvpEvent);

export default router;
