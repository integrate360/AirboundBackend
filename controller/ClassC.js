const AsyncHandler = require("express-async-handler");
const Class = require("../model/ClassM");

const createClass = AsyncHandler(async (req, res) => {
  const { packages, locations, trainers, availability } = req.body;
  try {
    let imgPath = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        imgPath.push(req.files[i].filename);
      }
    }
    // create new Class
    const newClass = new Class({
      ...req.body,
      packages: JSON.parse(packages),
      locations: JSON.parse(locations),
      trainers: JSON.parse(trainers),
      availability: JSON.parse(availability),
      image: imgPath,
    });
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
    const classes = await Class.find({ active: true })
      .populate("category")
      .populate("trainers");

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
  const { packages, locations, trainers, availability } = req.body;
  try {
    let imgPath = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        imgPath.push(req.files[i].filename);
      }
      req.body.image = imgPath;
    }

    // get one class
    const updateClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        packages: JSON.parse(packages),
        locations: JSON.parse(locations),
        trainers: JSON.parse(trainers),
        availability: JSON.parse(availability),
      },
      {
        new: true,
      }
    );

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
