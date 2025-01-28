const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db.js");
const app = express();
connectDB();

app.use("/public", express.static("public"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
app.use("/api", require("./route/EnquiryR.js"));
app.use("/api", require("./route/bacheloretteR.js"));

const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
