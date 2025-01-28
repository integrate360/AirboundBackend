const express = require("express");
const {
  createBachelorette,
  getAllBachelorettes,
  getBacheloretteById,
  updateBachelorette,
  deleteBachelorette,
} = require("../controller/bacheloretteC");

const router = express.Router();

// Create a new bachelorette event
router.post("/bachelorette", createBachelorette);

// Get all bachelorette events
router.get("/bachelorette", getAllBachelorettes);

// Get a specific bachelorette event by ID
router.get("/bachelorette/:id", getBacheloretteById);

// Update a specific bachelorette event
router.put("/achelorette/:id", updateBachelorette);

// Delete a specific bachelorette event
router.delete("/bachelorette/:id", deleteBachelorette);

module.exports = router;
