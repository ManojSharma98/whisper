import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chatController";

const router = Router();

// Define your authentication routes here

router.use(protectRoute); // Apply the protectRoute middleware to all routes in this router

router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat);
export default router;
