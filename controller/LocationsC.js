const AsyncHandler = require("express-async-handler");
const Location = require("../model/LocationM");

const all = AsyncHandler(async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getLocation = AsyncHandler(async (req, res, next) => {
  let location;
  try {
    location = await Location.findById(req.params.id);
    if (location == null) {
      return res.status(404).json({ message: "Cannot find location" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.location = location;
  next();
});

const Create = AsyncHandler(async (req, res) => {
  const location = new Location({
    name: req.body.name,
    address: req.body.address,
    googleMapLink: req.body.googleMapLink,
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const Update = AsyncHandler(async (req, res) => {
  if (req.body.name != null) {
    res.location.name = req.body.name;
  }
  if (req.body.address != null) {
    res.location.address = req.body.address;
  }
  if (req.body.googleMapLink != null) {
    res.location.googleMapLink = req.body.googleMapLink;
  }

  try {
    const updatedLocation = await res.location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// const Delete = AsyncHandler(async (req, res) => {
//   try {
//     await res.location.findByIdAndDelete();
//     res.json({ message: "Deleted Location" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

const Delete = AsyncHandler(async (req, res) => {
  try {
    const user = await Location.findByIdAndDelete(req.params.id);
    res.send({ message: "location removed" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  all,
  getLocation,
  Create,
  Update,
  Delete,
};
