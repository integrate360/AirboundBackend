// utils/cloudinary.js

const { v2: cloudinary } = require("cloudinary");
require("dotenv").config(); // Ensure dotenv is loaded

// Configure Cloudinary with the environment variable
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, // Use the URL from the .env file
});

module.exports = cloudinary;
