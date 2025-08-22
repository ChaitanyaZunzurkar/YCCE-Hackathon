import express from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);       // GET /api/user
router.put("/", authMiddleware, updateProfile);    // PUT /api/user
router.delete("/", authMiddleware, deleteAccount);// DELETE /api/user

export default router;
