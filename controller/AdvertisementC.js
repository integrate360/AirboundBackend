const AsyncHandler = require("express-async-handler");
const Advertisement = require("../model/AdvertisementM");
const  {uploadImage}  = require("../helper/fileUploadeService");
// Create an advertisement
// const createAdvertisement = AsyncHandler(async (req, res) => {
//   const { link, name, description } = req.body;

//   // Validate required fields
//   if (!link || !name || !description) {
//     throw new Error("All fields are required");
//   }

//   let imgUrl = "";
//   // Check if the image is uploaded and retrieve the Cloudinary URL
//   if (req.file) {
//     // Cloudinary provides the full URL in the 'path' property
//     imgUrl = req.file.path; // This contains the full Cloudinary URL
//   }

//   // Create a new advertisement with the Cloudinary URL for the image
//   const newAd = await Advertisement.create({
//     link,
//     name,
//     description,
//     image: imgUrl, // Store the full Cloudinary image URL
//   });

//   // Send the response
//   res.status(201).json({
//     success: true,
//     message: "Advertisement created successfully",
//     data: newAd,
//   });
// });
const createAdvertisement = AsyncHandler(async (req, res) => {
  const { link, name, description } = req.body;

  // Validate required fields
  if (!link || !name || !description) {
    throw new Error("All fields are required");
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

  // Create a new advertisement with the AWS S3 URL for the image
  const newAd = await Advertisement.create({
    link,
    name,
    description,
    image: imgUrl, // Store the AWS S3 image URL
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
