const AsyncHandler = require("express-async-handler");
const Class = require("../model/ClassM");

const createClass = AsyncHandler(async (req, res) => {
  const { availability } = req.body;

  try {
    let imgUrls = [];
    if (req.files) {
      // Loop through the uploaded files and push the Cloudinary URL to imgUrls array
      for (let i = 0; i < req.files.length; i++) {
        imgUrls.push(req.files[i].path); // Assuming 'path' contains the full Cloudinary URL
      }
    }

    // Create new Class instance
    const newClass = new Class({
      ...req.body,
      availability: JSON.parse(availability), // Parsing the 'availability' field
      image: imgUrls, // Store the Cloudinary URLs in the 'image' field
    });

    // Save to DB
    await newClass.save();

    // Send response
    res.status(200).json({
      message: "Class Created Successfully",
      data: newClass,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getClasses = AsyncHandler(async (req, res) => {
  try {
    // get all classes
    const classes = await Class.find()
      .populate("category")
      .populate("availability.trainers")
      .populate("availability.locations");

    // send the response
    res
      .status(200)
      .json({ message: "classes fetched successfully", data: classes });
  } catch (error) {
    throw new Error(error);
  }
});

const getClassById = AsyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error("Please Provide the id");
  try {
    // get one class
    const getClass = await Class.findById(req.params.id);

    // if class not found
    if (!getClass) throw new Error("Class not found with this id");

    // send the response
    res
      .status(200)
      .json({ message: "class fetched successfully", data: getClass });
  } catch (error) {
    throw new Error(error);
  }
});

const updateClass = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Please provide the id");

  try {
    const { packages, locations, trainers, availability, ...otherData } =
      req.body;

    // Handle image uploads
    const imgPath = req.files?.map((file) => file.path) || [];
    if (imgPath.length) otherData.image = imgPath;

    console.log(imgPath);

    // Update the class
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        ...otherData,
        availability: availability ? JSON.parse(availability) : undefined,
      },
      { new: true }
    );

    // If class not found
    if (!updatedClass) throw new Error("Class not found with this id");

    // Send the response
    res.status(200).json({
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while updating the class"
    );
  }
});

const deleteClass = AsyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error("Please Provide the id");
  try {
    // get all classes
    const delClass = await Class.findByIdAndDelete(req.params.id);

    // if class not found
    if (!delClass) throw new Error("Class not found with this id");

    // send the response
    res
      .status(200)
      .json({ message: "class deleted successfully", data: delClass });
  } catch (error) {
    throw new Error(error);
  }
});
const getTotalClasses = AsyncHandler(async (req, res) => {
  try {
    const classes = await Class.find({});
    res.send({ totalClasses: classes.length });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = {
  createClass,
  getClasses,
  getClassById,
  deleteClass,
  updateClass,
  getTotalClasses,
};
