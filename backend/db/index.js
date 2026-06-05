import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();


const connectToDatabase=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connect to databaseeeee");
    }catch(error){
        console.error("Error connecting to database :",error);
    }
}

export default connectToDatabase;