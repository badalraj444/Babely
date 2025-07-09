import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullName, gender } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists! please use a different one." });
        }

        // const idx = Math.floor(Math.random()*100) + 1;
        const randomAvatar = `https://xsgames.co/randomusers/avatar.php?g=${gender}`;
        const newUser = await User.create({
            email,
            fullName,
            password,
            gender,
            profilePic: randomAvatar,

        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user: ", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fileds are required!" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials. Please check the email or password!" });
        }
        const isPaaswordCorrect = await user.matchPassword(password);
        if (!isPaaswordCorrect) return res.status(401).json({ message: "Invalid credentials. Please check the email or password!" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, messgae: "Logged out successfully!" });
};

export async function onboard(req, res) {
    //    console.log(req.user);
    try {
        const userId = req.user._id

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [!fullName && "fullName",
                !bio && "bio",
                !nativeLanguage && "nativeLanguage",
                !learningLanguage && "learningLanguage",
                !location && "location",
                ].filter(Boolean),
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarde: true,
        }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        //TODO: update the user info in stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (error) {
             console.log("Error updating Stream user after onboarding:",error.message);
        }
        res.status(200).json({ success: true, user: updatedUser });
        console.log("Onboarding successful!");
    } catch (error) {
        console.log("Error in onBoarding the user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}