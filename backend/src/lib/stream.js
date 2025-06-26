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
//todo later
export const generateStreamToken = (userId)=>{};