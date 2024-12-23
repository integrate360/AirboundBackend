const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Contact = require("../model/Contact.js");
const Admin = require("../model/Admin");
const genrateToken = require("../utils/genrateToken.js");
// admin login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // verify email and passowrd
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error("No admin found with this Email");
    const verifyPassword = bcrypt.compare(admin.password, password);
    if (!verifyPassword) throw new Error("Wrong Credentials");

    // save to cookie
    const token = genrateToken(admin.id);
    // give token
    admin.token = token;
    admin.save();
    res.send(admin);
  } catch (error) {
    throw new Error(error);
  }
});

// Function to view all contacts
const viewContact = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  viewContact,
  adminLogin,
};
