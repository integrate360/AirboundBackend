const asyncHandler = require("express-async-handler");
const User = require("../model/UserM");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.Sendgrid_Key);
const { generatePassword } = require("../utils/Functions");
const admin = require('../config/firebaseConfig');


// const sendPushNotification = async (req, res) => {
//   try {
//     // Get the user from the database based on user ID (or you could use email, etc.)
//     const user = await User.findById(req.params.userId);  // Assuming you're sending notification to a specific user by ID
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const { deviceToken } = user;  // Get deviceToken from the user

//     // Check if the device token exists
//     if (!deviceToken) {
//       return res.status(400).json({ message: 'Device token is missing' });
//     }

//     // Create message payload
//     const message = {
//       notification: {
//         title: 'New Notification',
//         body: req.body.message,  // Message from the request body
//       },
//       token: deviceToken,  // Use user's stored device token
//     };

//     // Send notification
//     const response = await admin.messaging().send(message);
//     console.log('Successfully sent message:', response);

//     res.status(200).json({ message: 'Notification sent successfully', response });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ message: 'Error sending notification', error });
//   }
// };
const sendPushNotification = async (req, res) => {
  try {
    // Get the user from the database based on user ID
    const user = await User.findById(req.params.userId);  // Sending notification to a specific user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { deviceToken } = user;  // Get deviceToken from the user

    // Check if the device token exists
    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token is missing' });
    }

    // Define the logo URL (use the absolute URL of your logo image)
    const logoUrl = 'https://airboundfitnessnew.s3.ap-south-1.amazonaws.com/airboundfitness/1736425167169-ASS.png'; 

    // Create message payload
    const message = {
      notification: {
        title: 'New Notification',
        body: req.body.message,  // Message from the request body
        imageUrl: logoUrl,  // Include logo image in the notification
      },
      token: deviceToken,  // Use the user's stored device token
    };

    // Send notification
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
};


const register = asyncHandler(async (req, res) => {
  const { email, password, phone, name, deviceToken } = req.body;

  // Check if user already exists with the provided email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists with this email" });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the provided data
    const newUser = new User({
      name,
      email,
      phone,
      deviceToken,  // Save the device token received from the client
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a token for the user (JWT or custom token)
    const token = genrateToken(newUser._id); // Ensure the generateToken function is correct
    newUser.token = token;  // Store the token (optional, depending on your needs)

    // Optionally, save the token to the user document (if needed)
    await newUser.save();

    // Return the success response with user details and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        deviceToken: newUser.deviceToken,
      },
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

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

// const register = asyncHandler(async (req, res) => {
//   const { email, password, phone, name, deviceToken } = req.body;

//   // Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists with this email" });
//   }

//   try {
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       phone,
//       deviceToken,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // Generate token
//     const token = genrateToken(newUser._id); // Ensure the function name is correct
//     newUser.token = token; // Set token on newUser object

//     // Optionally, save the user again if the token is to be stored
//     await newUser.save();

//     // Return successful response with user and token
//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         phone: newUser.phone,
//         deviceToken: newUser.deviceToken,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  const password = generatePassword();
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    existingUser.password = hashedPassword;
    await existingUser.save();

    // Generate token
    const msg = {
      to: email,
      from: "airboundfitness@gmail.com",
      subject: "Password Genrated",
      text: `Your Password is genrated, simply enter this ${password} to login to your existing account`,
      html: `<p>Your Password is genrated, simply enter this <b>${password}</b> to login to your existing account</p>`,
    };

    await sgMail.send(msg);
    const token = genrateToken(existingUser._id); // Ensure function name is correct
    existingUser.token = token; // Set token on existingUser object
    await existingUser.save();
    res.status(200).json(existingUser); // Use 201 for successful resource creation
  } catch (error) {
    res.status(201).json({ message: error.message }); // 500 for server errors
  }
});
const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword, email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  const verifyPassword = await bcrypt.compare(password, existingUser.password);
  if (!verifyPassword)
    return res.status(303).json({ message: "Wrong Credentials" });
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Create new user
    existingUser.password = hashedPassword;
    await existingUser.save();

    // Generate token
    const token = genrateToken(existingUser._id); // Ensure function name is correct
    existingUser.token = token; // Set token on existingUser object
    await existingUser.save();

    res.status(200).json(existingUser); // Use 201 for successful resource creation
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

// // Forgot Password - send email with reset link
// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Generate reset token and set expiration date (1 hour)
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

//     // Save reset token and expiry time in user document
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = resetTokenExpiry;
//     await user.save();

//     // Send reset password email
//     const resetUrl = `http://yourfrontend.com/reset-password?token=${resetToken}`;
//     const msg = {
//       to: email,
//       from: "no-reply@yourdomain.com",
//       subject: "Password Reset Request",
//       text: `To reset your password, please click on the following link: ${resetUrl}`,
//       html: `<p>To reset your password, please click on the following link: <a href="${resetUrl}">Reset Password</a></p>`,
//     };

//     await sgMail.send(msg);
//     res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Reset Password - set new password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user by reset token and check if token is valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  sendPushNotification,
  login,
  getAllUsers,
  resetPassword,
  forgotPassword,
  totalUsers,
  deleteUser,
  getUser,
  logout,
  register,
  forgotPassword,
  changePassword,
};
