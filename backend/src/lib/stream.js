import {StreamChat} from "stream-chat";
import "dotenv/config";

const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET;
console.log(apikey," ,",apiSecret);

if(!apikey || !apiSecret){
    console.log("Stream API key or secret is missing!");
}

const streamClient = StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser = async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        console.log("Stream user upserted successfully!");
        return userData;
    } catch (error) {
        console.log("Error upserting Stream user: ",error);
    }
};

export const generateStreamToken = (userId)=>{
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error generating Stream token: ",error);
    }
};

export const deleteStreamUser = async (userId)=>{
    try {
        //todo! also delete channels for chats with this user
        const userIdStr = userId.toString();
        await streamClient.deleteUser(userIdStr);
        console.log("Stream user deleted successfully!");
    } catch (error) {
        console.log("Error deleting Stream user: ",error);
    }
}