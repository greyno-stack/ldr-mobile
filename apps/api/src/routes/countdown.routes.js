import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"; // adjust to your actual path
import { getCountdown, createCountdown, deleteCountdown } from "../controllers/countdown.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getCountdown);
router.post("/", protectRoute, createCountdown);
router.delete("/", protectRoute, deleteCountdown);

export default router;