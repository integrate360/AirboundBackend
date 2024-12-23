const AsyncHandler = require("express-async-handler");
const Advertisement = require("../models/Advertisement");

// Create an advertisement
const createAdvertisement = AsyncHandler(async (req, res) => {
  const { link, name, description, image } = req.body;
  let imgPath = "";
  if (req.file) {
    imgPath = req.file.filename;
  }
  // Validate required fields
  if (!link || !name || !description || !image) {
    throw new Error("All fields are required");
  }

  // Create a new advertisement
  const newAd = await Advertisement.create({
    link,
    name,
    description,
    image: imgPath,
  });

  // Send the response
  res.status(201).json({
    success: true,
    message: "Advertisement created successfully",
    data: newAd,
  });
});

// Get all advertisements
const getAllAdvertisements = AsyncHandler(async (req, res) => {
  const ads = await Advertisement.find();

  res.status(200).json({
    success: true,
    message: "Advertisements fetched successfully",
    data: ads,
  });
});

// Get an advertisement by ID
const getAdvertisementById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const ad = await Advertisement.findById(id);

  if (!ad) throw new Error("Advertisement not found with this ID");

  res.status(200).json({
    success: true,
    message: "Advertisement fetched successfully",
    data: ad,
  });
});

// Update an advertisement by ID
const updateAdvertisement = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const updatedAd = await Advertisement.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedAd) throw new Error("Advertisement not found with this ID");

  res.status(200).json({
    success: true,
    message: "Advertisement updated successfully",
    data: updatedAd,
  });
});

// Delete an advertisement by ID
const deleteAdvertisement = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const deletedAd = await Advertisement.findByIdAndDelete(id);

  if (!deletedAd) throw new Error("Advertisement not found with this ID");

  res.status(200).json({
    success: true,
    message: "Advertisement deleted successfully",
    data: deletedAd,
  });
});

module.exports = {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
};
