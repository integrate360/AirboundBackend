const AsyncHandler = require("express-async-handler");
const moment = require("moment");
const Package = require("../model/PackageM");
const User = require("../model/UserM");
const Notification = require("../model/Notifications");

// Send notification for package expiry to users before 5 days
const sendNotification = async (user, message) => {
  try {
    // Create a new notification in the database
    const notification = new Notification({
      userId: user._id,
      message,
      subject: "Package Expiry Reminder",
    });

    await notification.save(); // Save the notification to the database
    console.log(`Notification sent to ${user.email}: ${message}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Check for package expiry and notify users
const notifyPackageExpiry = AsyncHandler(async (req, res) => {
  const fiveDaysFromNow = moment().add(5, "days").toDate();

  // Find packages expiring in the next 5 days
  const expiringPackages = await Package.find({
    expiryDate: { $lte: fiveDaysFromNow },
  }).populate("user");

  // Notify users
  expiringPackages.forEach((pkg) => {
    const message = `Your package "${pkg.name}" is expiring in less than 5 days. Please renew it soon.`;
    sendNotification(pkg.user, message);
  });

  res.status(200).json({
    success: true,
    message: "Notifications sent for expiring packages",
  });
});

// Create a new package
const createPackage = AsyncHandler(async (req, res) => {
  const { name, services, duration, price, days, description, category } =
    req.body;

  if (!name) throw new Error("Package name is required");

  const newPackage = await Package.create({
    name,
    services,
    duration,
    category,
    description,
    price,
    days,
  });

  res
    .status(201)
    .json({ message: "Package created successfully", data: newPackage });
});

// Get all packages
const getPackages = AsyncHandler(async (req, res) => {
  const packages = await Package.find()
    .populate("services")
    .populate("category");
  res
    .status(200)
    .json({ message: "Packages retrieved successfully", data: packages });
});

const getClassPackages = AsyncHandler(async (req, res) => {
  const { id } = req.params; // Expecting a query parameter for the service ID

  try {
    const packages = await Package.find({ services: { $in: [id] } }).populate({
      path: "services",
      populate: [
        { path: "availability.trainers", model: "Staff" },
        { path: "availability.locations", model: "Location" },
      ],
    });

    res.status(200).json({
      message: "Packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving packages",
      error: error.message,
    });
  }
});

const getCategoryPackages = async (req, res) => {
  try {
    const packages = await Package.find({ category: req.params.id }).populate({
      path: "services",
      populate: [
        { path: "availability.trainers", model: "Staff" },
        { path: "availability.locations", model: "Location" },
      ],
    });

    res.status(200).json({ success: true, packages: packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single package by ID
const getPackageById = AsyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error("Package ID is required");

  const package = await Package.findById(req.params.id).populate("services");

  if (!package) throw new Error("Package not found with this ID");

  res
    .status(200)
    .json({ message: "Package retrieved successfully", data: package });
});

// Update a package
const updatePackage = AsyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error("Package ID is required");

  const updatedPackage = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("services");

  if (!updatedPackage) throw new Error("Package not found with this ID");

  res
    .status(200)
    .json({ message: "Package updated successfully", data: updatedPackage });
});

// Delete a package
const deletePackage = AsyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error("Package ID is required");

  const delPackage = await Package.findByIdAndDelete(req.params.id);

  if (!delPackage) throw new Error("Package not found with this ID");

  res
    .status(200)
    .json({ message: "Package deleted successfully", data: delPackage });
});

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getClassPackages,
  getCategoryPackages,
  notifyPackageExpiry,
};
