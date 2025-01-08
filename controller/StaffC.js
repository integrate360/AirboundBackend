const AsyncHandler = require("express-async-handler");
const Staff = require("../model/StaffM");
const  {uploadImage}  = require("../helper/fileUploadeService");
// Create a category
const createStaff = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name || !description) {
    throw new Error("name, image and description  are required");
  }

  let imgUrl = "";

  // Check if the image is uploaded and use the uploadImage function
  if (req.file) {
    try {
      // Upload the image to AWS S3 using the uploadImage function
      imgUrl = await uploadImage(req.file);
    } catch (err) {
      console.error("Image upload failed:", err);
      throw new Error("Image upload failed");
    }
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

const updateStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  let imgUrl = "";

  // Check if an image is uploaded and use the uploadImage function
  if (req.file) {
    try {
      // Upload the image to AWS S3 using the uploadImage function
      imgUrl = await uploadImage(req.file);
    } catch (err) {
      console.error("Image upload failed:", err);
      throw new Error("Image upload failed");
    }
  }

  // Prepare update object
  const updateData = { ...req.body };
  
  // If an image was uploaded, include the image URL in the update
  if (imgUrl) {
    updateData.imageUrl = imgUrl;  // Assuming you have an `imageUrl` field in your Staff model
  }

  // Update the staff/category by ID
  const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, {
    new: true,
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
