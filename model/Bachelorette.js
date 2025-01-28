const mongoose = require("mongoose");

const bacheloretteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  
  eventName: {
    type: String,
    required: true,
    trim: true,
  },

  notes: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
  },
});

bacheloretteSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Bachelorette", bacheloretteSchema);
