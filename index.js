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

app.use("/api", require("./route/Admin"));
app.use("/api", require("./route/Class"));
app.use("/api", require("./route/Advertisement"));
app.use("/api", require("./route/Category"));
app.use("/api", require("./route/User"));
app.use("/api", require("./route/Booking"));

// running on port
app.listen(process.env.PORT, () => {
  console.log(`connected to server at port ${process.env.PORT}`);
  connect();
});
