import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { authCallback, getMe } from "../controllers/authController";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/callback", protectRoute, authCallback);

export default router;
