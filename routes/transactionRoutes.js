const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Vehicle = require('../models/Vehicle');
const TollBooth = require('../models/TollBooth');
const { protect } = require('../middleware/authMiddleware');

// GET all transactions (with vehicle & booth details)
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('vehicle', 'plateNumber vehicleType ownerName')   // 🔗 Join vehicle data
      .populate('tollBooth', 'name location')                     // 🔗 Join booth data
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create transaction (process toll payment)
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, tollBoothId, paymentMethod } = req.body;

    // Find vehicle and booth
    const vehicle = await Vehicle.findById(vehicleId);
    const booth = await TollBooth.findById(tollBoothId);

    if (!vehicle || !booth) {
      return res.status(404).json({ message: 'Vehicle or booth not found' });
    }

    // Calculate toll amount based on vehicle type
    const amount = booth.rates[vehicle.vehicleType];

    // Check if vehicle has enough balance (for FASTag)
    let status = 'success';
    if (paymentMethod === 'fastag' && vehicle.balance < amount) {
      status = 'failed';
    }

    // Deduct balance if FASTag payment successful
    if (paymentMethod === 'fastag' && status === 'success') {
      vehicle.balance -= amount;
      await vehicle.save();
    }

    // Create transaction record
    const transaction = await Transaction.create({
      vehicle: vehicleId,
      tollBooth: tollBoothId,
      amount,
      paymentMethod,
      status
    });

    const populated = await transaction.populate([
      { path: 'vehicle', select: 'plateNumber vehicleType ownerName' },
      { path: 'tollBooth', select: 'name location' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;