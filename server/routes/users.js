const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET current logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET public profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch their public portfolio & listings
    const [portfolio, listings] = await Promise.all([
      Product.find({ artist: req.params.id, status: { $ne: 'deleted' } })
        .sort({ createdAt: -1 })
        .limit(12)
        .select('title image price type currentBid artType'),
      Job.find({ postedBy: req.params.id, status: 'open' })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('title category budget budgetType createdAt'),
    ]);

    res.json({ user, portfolio, listings });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH update profile
router.patch('/me', auth, async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'skills', 'location', 'website', 'social'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
