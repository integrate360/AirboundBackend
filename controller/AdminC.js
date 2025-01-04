const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Contact = require("../model/ContactM.js");
const Admin = require("../model/AdminM.js");
const genrateToken = require("../utils/genrateToken.js");
// admin login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verify if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error("No admin found with this Email");

    // Compare passwords
    const verifyPassword = await bcrypt.compare(password, admin.password);
    if (!verifyPassword) throw new Error("Wrong Credentials");

    // Generate and send token
    const token = genrateToken(admin._id);
    res.json({
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // check if admin already exists
    const admin = await Admin.findOne({ email });
    if (admin) throw new Error("Admin already exists with this email");

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create new admin
    const newAdmin = new Admin({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.send(newAdmin);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerAdmin,
  adminLogin,
};
