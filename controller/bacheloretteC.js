const Bachelorette = require("../model/Bachelorette");

// Create a new bachelorette event
const createBachelorette = async (req, res) => {
  try {
    const bachelorette = new Bachelorette(req.body);
    await bachelorette.save();
    res.status(201).json({ success: true, data: bachelorette });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bachelorette events
const getAllBachelorettes = async (req, res) => {
  try {
    const bachelorettes = await Bachelorette.find();
    res.status(200).json({ success: true, data: bachelorettes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific bachelorette event by ID
const getBacheloretteById = async (req, res) => {
  try {
    const { id } = req.params;
    const bachelorette = await Bachelorette.findById(id);
    if (!bachelorette) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: bachelorette });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a specific bachelorette event
const updateBachelorette = async (req, res) => {
  try {
    const { id } = req.params;
    const bachelorette = await Bachelorette.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bachelorette) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: bachelorette });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a specific bachelorette event
const deleteBachelorette = async (req, res) => {
  try {
    const { id } = req.params;
    const bachelorette = await Bachelorette.findByIdAndDelete(id);
    if (!bachelorette) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateBachelorette,
  deleteBachelorette,
  createBachelorette,
  getAllBachelorettes,
  getBacheloretteById,
};
