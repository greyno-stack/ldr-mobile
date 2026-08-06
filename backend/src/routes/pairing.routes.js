import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js"; // adjust to your actual filename
import { getPairingStatus, getOrCreateInvite, joinWithCode } from "../controllers/pairing.controllers.js";

const router = express.Router();

router.get("/status", getPairingStatus);
router.get("/invite", getOrCreateInvite);
router.post("/join", joinWithCode);

// router.get("/status", protectRoute, getPairingStatus);
// router.get("/invite", protectRoute, getOrCreateInvite);
// router.post("/join", protectRoute, joinWithCode);

export default router;