import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const DB_URI = process.env.DB_URI;
// console.log(DB_URI);

const connectDb = async () => {
  try {
    const db = await mongoose.connect(`${DB_URI}/${DB_NAME}`);
    // isConnected = db.connections[0].readyState === 1;
    // console.log(isConnected);
    console.log("MongoDB connected!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDb;
