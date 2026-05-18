const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Vehicle = require('../models/Vehicle');
const TollBooth = require('../models/TollBooth');
const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalBooths = await TollBooth.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Sum of all successful transaction amounts
    const revenueResult = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent 5 transactions
    const recentTransactions = await Transaction.find()
      .populate('vehicle', 'plateNumber vehicleType')
      .populate('tollBooth', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalVehicles,
      totalBooths,
      totalTransactions,
      totalRevenue,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;