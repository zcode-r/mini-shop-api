import mongoose from "mongoose"

const DB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected")
    }
    catch(err){
        console.error(err)
        process.exit(1)
    }
}

export default DB