const AsyncHandler = require("express-async-handler");
const Class = require("../model/Class");

const createClass = AsyncHandler(async (req, res) => {
  try {
    let imgPath = "";
    if (req.file) {
      imgPath = req.file.filename;
    }
    // create new Class
    const newClass = new Class({ ...req.body, image: imgPath });
    await newClass.save(); // saving in DB

    // send the response
    res
      .status(200)
      .json({ message: "Class Created Successfully", data: newClass });
  } catch (error) {
    throw new Error(error);
  }
});

const getClasses = AsyncHandler(async (req, res) => {
  try {
    // get all classes
    const classes = await Class.find({ active: true });

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
  if (!req.params.id) throw new Error("Please Provide the id");
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // get one class
    const updateClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // if class not found
    if (!updateClass) throw new Error("Class not found with this id");

    // send the response
    res
      .status(200)
      .json({ message: "class Updated successfully", data: updateClass });
  } catch (error) {
    throw new Error(error);
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
module.exports = {
  createClass,
  getClasses,
  getClassById,
  deleteClass,
  updateClass,
};
