const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  placedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['for_sale', 'auction', 'digital'],
    default: 'for_sale',
  },
  artType: {
    type: String,
    enum: [
      'Painting', 'Photography', 'Digital Art', 'Sculpture',
      'Textile', 'Jewelry', 'Ceramics', 'Print', 'Mixed Media', 'Other'
    ],
    default: 'Other',
  },
  medium: { type: String },
  dimensions: { type: String },

  // For direct sale
  price: { type: Number },

  // For auctions
  startingBid: { type: Number },
  currentBid: { type: Number },
  auctionEnd: { type: Date },
  bids: [bidSchema],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'ended', 'deleted'],
    default: 'active',
  },
  sold: { type: Boolean, default: false },
  soldAt: { type: Date },
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldFor: { type: Number },

  // Meta
  tags: [{ type: String, trim: true }],
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
