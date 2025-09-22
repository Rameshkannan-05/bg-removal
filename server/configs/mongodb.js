import mongoose from "mongoose";

const connectDB = async ()=>{
    // if connected
    mongoose.connection.on('connected',()=>{
        console.log('Database Connected')
    })

    // connecting to DB
    await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`);
}

export default connectDB