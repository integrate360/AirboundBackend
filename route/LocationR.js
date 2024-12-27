const express = require("express");
const router = express.Router();
const {
  all,
  getLocation,
  Create,
  Update,
  Delete,
} = require("../controller/LocationsC");

// Get all locations
router.get("/allocations", all);

// Get a single location by ID
router.get("locations/:id", getLocation, (req, res) => {
  res.json(res.location);
});

// Create a new location
router.post("/locations", Create);

// Update a location by ID
router.put("locations/:id", getLocation, Update);

// Delete a location by ID
router.delete("/locations/:id", Delete);

module.exports = router;
