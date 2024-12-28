const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MongoDBURI);  // Debugging: Ensure URI is loaded correctly
    await mongoose.connect(process.env.MongoDBURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
