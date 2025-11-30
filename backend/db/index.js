const mongoose=require("mongoose")
require("dotenv").config();

const database_url=process.env.DATABASE_URL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectToDatabase=async()=>{
    try{
        await mongoose.connect(database_url,connectionParams);
        console.log("Connect to database");
    }catch(error){
        console.error("Error connecting to database :",error);
    }
}

module.exports=connectToDatabase;