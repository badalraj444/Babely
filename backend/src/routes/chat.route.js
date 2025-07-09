import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controller/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;

