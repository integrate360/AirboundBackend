const AsyncHandler = require("express-async-handler");
const Staff = require("../model/StaffM");

// Create a category
const createStaff = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

 
  // Validate required fields
  if (!name || !description) {
    throw new Error("name, image and description  are required");
  }


  let imgUrl = "";
  // Check if the image is uploaded and retrieve the Cloudinary URL
  if (req.file) {
    // Cloudinary provides the full URL in the 'path' property
    imgUrl = req.file.path; // This contains the full Cloudinary URL
  }
  // Create a new category
  const newStaff = await Staff.create({ name, description, image: imgUrl });

  // Send the response
  res.status(200).json({
    success: true,
    message: "Staff created successfully",
    data: newStaff,
  });
});

// Get all categories
const getAllStaffs = AsyncHandler(async (req, res) => {
  const categories = await Staff.find();

  res.status(200).json({
    success: true,
    message: "Staffs fetched successfully",
    data: categories,
  });
});

// Get a category by ID
const getStaffById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const category = await Staff.findById(id);

  if (!category) throw new Error("Staff not found with this ID");

  res.status(200).json({
    success: true,
    message: "Staff fetched successfully",
    data: category,
  });
});

// Update a category by ID
const updateStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedStaff) throw new Error("Staff not found with this ID");

  res.status(200).json({
    success: true,
    message: "Staff updated successfully",
    data: updatedStaff,
  });
});

// Delete a category by ID
const deleteStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const deletedStaff = await Staff.findByIdAndDelete(id);

  if (!deletedStaff) throw new Error("Staff not found with this ID");

  res.status(200).json({
    success: true,
    message: "Staff deleted successfully",
    data: deletedStaff,
  });
});
const getTotalStaffs = AsyncHandler(async (req, res) => {
  const staffs = await Staff.find({});
  res.send({ totalStaffs: staffs.length });
});

module.exports = {
  createStaff,
  getAllStaffs,
  getStaffById,
  updateStaff,
  deleteStaff,
  getTotalStaffs,
};
