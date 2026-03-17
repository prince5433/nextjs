import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nextjs";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {// Check if already connected
      console.log("Already connected!");
      return;
    }
    await mongoose.connect(DB_URI);// Connect to the database
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
    console.log("Database not connected!");
    process.exit(1);// Exit the process with failure
  }
};