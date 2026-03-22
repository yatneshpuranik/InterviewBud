import mongoose from "mongoose";

const connectDB = async () =>
{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Db Connected");
        
    } catch (error) {
        console.log(`db connection error ${error}`);
    }
}

export default connectDB;