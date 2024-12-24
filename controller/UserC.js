const asyncHandler = require("express-async-handler");
const User = require("../model/UserM");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");
// login
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

// register
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

module.exports = {
  login,
  register,
};
