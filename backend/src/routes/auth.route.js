import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
import {login,logout,onboard,signup} from "../controller/auth.controller.js"

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",protectRoute, onboard) //todo create protectRoute function

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,
        user: req.user,
    });
})
export default router;