import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const database_url=process.env.DATABASE_URL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectToDatabase=async()=>{
    try{
        await mongoose.connect(database_url,connectionParams);
        console.log("Connect to databaseeeee");
    }catch(error){
        console.error("Error connecting to database :",error);
    }
}

export default connectToDatabase;