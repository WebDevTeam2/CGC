import mongoose from "mongoose";

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;
    return connection;
  } catch (error) {
    console.log("Error connecting to the database");    
  }
};

export default connect;
