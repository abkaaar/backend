const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  reviewer: { // The user writing the review
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedSpace: { // The host or company being reviewed
    type: Schema.Types.ObjectId,
    ref: 'Space',
    required: true,
  },
  rating: { // The rating score
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming 1 to 5 star rating system
  },
  review: { // The review content
    type: String,
    trim: true,
    maxlength: 500, // Optional character limit
  },
  createdAt: { // The creation timestamp
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
