import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendNote, getNotes, dismissNote } from "../controllers/note.controllers.js";

const router = express.Router();

router.post("/", protectRoute, sendNote);
router.get("/", protectRoute, getNotes);
router.patch("/:id/dismiss", protectRoute, dismissNote);

export default router;
