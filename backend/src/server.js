import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js"
import {connectDB} from "./lib/db.js"

const PORT = process.env.PORT;
const app = express();

app.use("/api",authRoutes);
app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
    connectDB();
});
