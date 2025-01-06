const asyncHandler = require("express-async-handler");
const User = require("../model/UserM");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // verify email and passowrd
    const user = await User.findOne({ email });
    if (!user)
      return res.status(303).json({ message: "No user found with this Email" });
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword)
      return res.status(303).json({ message: "Wrong Credentials" });

    // save to cookie
    const token = genrateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    //update signin
    user.token = token;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(303).json(error);
  }
});
const register = asyncHandler(async (req, res) => {
  const { email, password, phone, name } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(201)
      .json({ message: "User already exists with this email" });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate token
    const token = genrateToken(newUser._id); // Ensure function name is correct
    newUser.token = token; // Set token on newUser object
    await newUser.save();

    res.status(200).json(newUser); // Use 201 for successful resource creation
  } catch (error) {
    res.status(201).json({ message: error.message }); // 500 for server errors
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ message: "Logged Out" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User removed" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
const totalUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ totalUsers: users.length });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = {
  login,
  getAllUsers,
  totalUsers,
  deleteUser,
  getUser,
  logout,
  register,
};
