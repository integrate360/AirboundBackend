const AsyncHandler = require("express-async-handler");
const Category = require("../model/CategoryM");
const  {uploadImage}  = require("../helper/fileUploadeService");

// Create a category
const createCategory = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
 
  // Validate required fields
  if (!title || !description) {
    throw new Error("Title and description are required");
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
  const newCategory = await Category.create({
    title,
    description,
    image: imgUrl,
  });

  // Send the response
  res.status(200).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});


// const createCategory = AsyncHandler(async (req, res) => {
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


// Get all categories
const getAllCategories = AsyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

// Get a category by ID
const getCategoryById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) throw new Error("Please provide an ID");

  const category = await Category.findById(id);

  if (!category) throw new Error("Category not found with this ID");

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

const updateCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "Please provide an ID" });
  }

  try {
    let updateData = { ...req.body };
    if (req.file) {
      try {
        const imgUrl = await uploadImage(req.file);
        updateData.image = imgUrl; 
      } catch (err) {
        console.error("Image upload failed:", err);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found with this ID" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


const deleteCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  
  if (!id) throw new Error("Please provide an ID");

  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) throw new Error("Category not found with this ID");

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: deletedCategory,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
