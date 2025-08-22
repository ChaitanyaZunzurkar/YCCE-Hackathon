// backend/routes/authRoutes.js
import express from "express";
import { signup, signin, getProfile } from "../controllers/auth.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/signup", signup);
router.post("/signin", signin);

// Protected
router.get("/profile", protect, getProfile);

export default router;
