const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Product = require('../models/Product');

// GET dashboard stats for logged-in user
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      postedJobs,
      activeJobs,
      completedJobs,
      myListings,
      soldItems,
      proposals,
    ] = await Promise.all([
      Job.countDocuments({ postedBy: userId }),
      Job.countDocuments({ postedBy: userId, status: 'open' }),
      Job.countDocuments({ postedBy: userId, status: 'completed' }),
      Product.countDocuments({ artist: userId }),
      Product.countDocuments({ artist: userId, sold: true }),
      Job.countDocuments({ 'proposals.freelancer': userId }),
    ]);

    // Total earnings from sold items
    const salesAgg = await Product.aggregate([
      { $match: { artist: userId, sold: true } },
      { $group: { _id: null, total: { $sum: '$soldFor' } } },
    ]);
    const totalEarnings = salesAgg[0]?.total || 0;

    // Recent activity — last 5 proposals on user's jobs
    const recentJobs = await Job.find({ postedBy: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status proposals updatedAt')
      .lean();

    // Recent sold items
    const recentSales = await Product.find({ artist: userId, sold: true })
      .sort({ soldAt: -1 })
      .limit(5)
      .select('title soldFor soldAt image')
      .lean();

    res.json({
      stats: {
        postedJobs,
        activeJobs,
        completedJobs,
        myListings,
        soldItems,
        proposals,
        totalEarnings,
      },
      recentJobs,
      recentSales,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
