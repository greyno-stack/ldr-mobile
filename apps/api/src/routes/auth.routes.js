import express from "express";
import { signup, verifyEmail, resendCode, login, logout, checkAuth, updatePushToken } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.patch("/push-token", protectRoute, updatePushToken);

export default router;