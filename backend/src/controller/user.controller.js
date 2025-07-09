import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.Id;
        const currentUser = req.user

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { $id: { $nin: currentUser.friends } },
                { isOnboarded: true },
            ],
        })
    } catch (error) {
        console.error("Error is getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getMyFriends(req, res) {
   try{
    const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage");
     res.status(200).json(user.friends);
   }catch(error){
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({message: "Internal server Error"});
   }
}

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId}=req.params;
        //prevent sending to yourself
        if(myId === recipientId){
            return res.status(400).json({message: "You cant send friend request to yourself"});
        }
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message: "Recipient not found"});
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"});

        }
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}

export async function acceptFriendRequest(req,res){
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        //verify current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }
        friendRequest.status = "accepted";
        await friendRequest.save();
        //add each other to friends list
        await User.findByIdAndUpdate(
            friendRequest.sender,
            { $addToSet: { friends: req.user.id } },
            { new: true }
        );
        await User.findByIdAndUpdate(
            friendRequest.recipient,
            { $addToSet: { friends: friendRequest.sender } },
            { new: true }
        );
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const userId = req.user.id;
        const incomingRequests = await FriendRequest.find({
            recipient: userId,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(incomingRequests);

        const acceptedRequests = await FriendRequest.find({
            recipient: userId,
            status: "accepted"
        }).populate("sender", "fullName profilePic");

        res.status(200).json({
            pendingRequests: incomingRequests,
            acceptedRequests: acceptedRequests
        });
    } catch (error) {
        console.error("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const userId = req.user.id;
        const outgoingRequests = await FriendRequest.find({
            sender: userId,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}