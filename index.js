const express = require("express");
const cors = require("cors");
const coookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorHandler.js");
app.use("/public", express.static("public"));
// Connect MongoDB.
const connect = () => {
  try {
    mongoose.connect(process.env.DB);
    console.log("connected to database");
  } catch (error) {
    throw new Error(error);
  }
};

// middlewares
app.use(cors());
app.use(express.json());
app.use(coookieParser());
app.use(errorHandler);

// custome routes
app.use("/api", require("./route/AdminR.js"));
app.use("/api", require("./route/LocationR.js"));
app.use("/api", require("./route/ClassR.js"));
app.use("/api", require("./route/AdvertisementR.js"));
app.use("/api", require("./route/CategoryR.js"));
app.use("/api", require("./route/UserR.js"));
app.use("/api", require("./route/BookingR.js"));
app.use("/api", require("./route/PaymentR.js"));
app.use("/api", require("./route/StaffR.js"));
app.use("/api", require("./route/PackageR.js"));

// running on port
app.listen(process.env.PORT, () => {
  console.log(`connected to server at port ${process.env.PORT}`);
  connect();
});
