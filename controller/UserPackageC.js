const UserPackagesM = require("../model/UserPackagesM");

// Get all bachelorette events
const getAllPackages = async (req, res) => {
  try {
    const bachelorettes = await UserPackagesM.find().populate("user");
    res.status(200).json({ success: true, data: bachelorettes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific bachelorette event by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const bachelorette = await UserPackagesM.findById(id)
      .populate("package")
      .populate("bookings")
      .populate({
        path: "package",
        populate: [
          {
            path: "services",
            populate: [
              { path: "availability.trainers", model: "Staff" },
              { path: "availability.locations", model: "Location" },
            ],
          },
        ],
      });
    if (!bachelorette) {
      return res
        .status(404)
        .json({ success: false, message: "Users Package not found" });
    }
    res.status(200).json({ success: true, data: bachelorette });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get a specific bachelorette event by ID
const getPackageByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const bachelorette = await UserPackagesM.find({ user: id }).populate(
      "package"
    );
    res.status(200).json({ success: true, data: bachelorette });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getAllPackages,
  getPackageById,
  getPackageByUserId,
};
