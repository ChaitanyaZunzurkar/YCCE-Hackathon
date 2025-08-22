import express from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/user.js";
import protect from "../middleware/middleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteAccount);

export default router;
