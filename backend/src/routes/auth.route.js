import express from "express";

const router = express.Router();
import {login,logout,signup} from "../controller/auth.controller.js"

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

export default router;