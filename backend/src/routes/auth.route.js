import express from "express";

const router = express.Router();
import {login,logout,signup} from "../controller/auth.controller.js"
router.get("/signup",signup);
router.get("/login",login);
router.get("/logout",logout);

export default router;