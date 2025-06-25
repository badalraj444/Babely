import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
          const conn = await mongoose.connect(process.env.MONGO_URL);
          console.log(`MONGODB connected: ${conn.connection.host}`)
    }catch(error){
        console.log("connection to database failed!",error);
        process.exit(1);
    }
};