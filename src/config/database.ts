import mongoose from "mongoose";
 
export const  connectDB= async ()=>{
    try{
         await mongoose.connect(process.env.DATABASE_URL as string)
         console.log("Mongo Db Connected successfully");
    }

    catch(error){
        console.log("Db Connection Failed",error);
        process.exit(1)
    }
}