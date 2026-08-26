import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getPairingStatus, getOrCreateInvite, joinWithCode } from "../controllers/pairing.controllers.js";

const router = express.Router();

router.get("/status", protectRoute, getPairingStatus);
router.get("/invite", protectRoute, getOrCreateInvite);
router.post("/join", protectRoute, joinWithCode);

export default router;