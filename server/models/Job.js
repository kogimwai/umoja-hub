const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Design & Art', 'Music & Audio', 'Writing & Translation',
      'Video & Animation', 'Photography', 'Web & Tech',
      'Fashion & Crafts', 'Marketing', 'Other'
    ],
    required: true,
  },
  tags: [{ type: String, trim: true }],
  budget: { type: Number },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly', 'negotiable'],
    default: 'fixed',
  },
  duration: { type: String },
  location: { type: String, default: 'Remote' },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proposals: [proposalSchema],
  deadline: { type: Date },
  attachments: [{ type: String }],
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Job', jobSchema);
