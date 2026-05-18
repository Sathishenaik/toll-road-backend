const mongoose = require('mongoose');

const tollBoothSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  highway: {
    type: String,
    required: true
  },
  rates: {
    car: { type: Number, default: 50 },
    truck: { type: Number, default: 150 },
    motorcycle: { type: Number, default: 25 },
    bus: { type: Number, default: 100 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TollBooth', tollBoothSchema);