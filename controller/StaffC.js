const AsyncHandler = require("express-async-handler");
const Staff = require("../model/StaffM");
const { uploadImage } = require("../helper/fileUploadeService");
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
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide an ID" });
  }

  try {
    let imgUrl = "";
    if (req.file) {
      console.log("Uploading image:", req.file); 
      imgUrl = await uploadImage(req.file);
      console.log("Image uploaded successfully:", imgUrl);
    }

    const updateData = { ...req.body };
    if (imgUrl) {
      updateData.image = imgUrl; 
    }
    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, 
    });

    if (!updatedStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found with this ID" });
    }

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const deleteStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;
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
