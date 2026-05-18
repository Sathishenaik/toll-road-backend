const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',        // 🔗 Reference to Vehicle collection
    required: true
  },
  tollBooth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TollBooth',      // 🔗 Reference to TollBooth collection
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['fastag', 'cash', 'card'],
    default: 'fastag'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);