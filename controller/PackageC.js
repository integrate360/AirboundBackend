const AsyncHandler = require("express-async-handler");
const Package = require("../model/PackageM");

// Create a new package
const createPackage = AsyncHandler(async (req, res) => {
  const { name, services, duration, price, days } = req.body;

  if (!name) throw new Error("Package name is required");

  const newPackage = await Package.create({
    name,
    services,
    duration,
    price,
    days,
  });

  res
    .status(201)
    .json({ message: "Package created successfully", data: newPackage });
});

// Get all packages
const getPackages = AsyncHandler(async (req, res) => {
  const packages = await Package.find().populate("services");
  res
    .status(200)
    .json({ message: "Packages retrieved successfully", data: packages });
});

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
};
