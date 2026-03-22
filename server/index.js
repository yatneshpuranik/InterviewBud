import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
dotenv.config();
import  authRouter from '../server/route/authRouter.js';
import userRouter from "./route/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors ({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/user' , userRouter);

// app.get ("/" , (req , res ) => {
//     return res.json({message : "Server connected"})
// })
const PORT = process.env.PORT || 6000 ;
app.listen( PORT , () =>
{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})