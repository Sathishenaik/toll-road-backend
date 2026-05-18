const express = require('express');
const router = express.Router();
const TollBooth = require('../models/TollBooth');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const booths = await TollBooth.find().sort({ createdAt: -1 });
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const booth = await TollBooth.create(req.body);
    res.status(201).json(booth);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const booth = await TollBooth.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booth) return res.status(404).json({ message: 'Toll booth not found' });
    res.json(booth);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await TollBooth.findByIdAndDelete(req.params.id);
    res.json({ message: 'Toll booth removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;