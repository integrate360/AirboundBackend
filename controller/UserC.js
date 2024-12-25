const asyncHandler = require("express-async-handler");
const User = require("../model/UserM");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // verify email and passowrd
    const user = await User.findOne({ email });
    if (!user) throw new Error("No user found with this Email");
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) throw new Error("Wrong Credentials");

    // save to cookie
    const token = genrateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    //update signin
    user.token = token;
    await user.save();
    res.send(user);
  } catch (error) {
    throw new Error(error);
  }
});
const register = asyncHandler(async (req, res) => {
  const { email, password, phone, name } = req.body;
  // if user exists
  const user = await User.findOne({ email });
  if (user) throw new Error("user already exist with this email");
  // hash password
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);
  try {
    // create new User
    const newUser = new User({
      name,
      email,
      phone,
      password: hash,
    });
    await newUser.save();
    res.send({ msg: "Successfully Registered", newUser });
  } catch (error) {
    throw new Error(error);
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
    console.log(error);
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

module.exports = {
  login,
  getAllUsers,
  deleteUser,
  getUser,
  logout,
  register,
};
