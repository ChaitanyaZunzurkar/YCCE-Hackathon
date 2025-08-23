import express from "express";
import { signup, signin } from "../controllers/auth.js";
// import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
