const express = require("express");
const router = express.Router();
const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getClassPackages,
} = require("../controller/PackageC");

// Route to create a new package
router.post("/package", createPackage);

// Route to get all packages
router.get("/package", getPackages);
router.get("/package/class/:id", getClassPackages);

// Route to get a package by ID
router.get("/package/:id", getPackageById);

// Route to update a package by ID
router.put("/package/:id", updatePackage);

// Route to delete a package by ID
router.delete("/package/:id", deletePackage);

module.exports = router;
