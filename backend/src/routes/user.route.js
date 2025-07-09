import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

import { getRecommendedUsers , getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests} from "../controller/user.controller.js";


router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friends/requests", getFriendRequests); 

router.get("/outgoing-friend-requests", getOutgoingFriendRequests);
export default router;