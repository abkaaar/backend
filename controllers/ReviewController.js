const Review = require("../models/Review");
const { asyncHandler } = require("../middlewares/error");
const Space = require('../models/Space');
// Add Review
module.exports.addReview = asyncHandler(async (req, res, next) => {
  
  try {
  const { user_id, space_id, name, email, rating, review } = req.body;


    // Check if user has already reviewed this space
    const existingReview = await Review.findOne({
      reviewer: user_id,
      reviewedSpace: space_id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this space'
      });
    }

    // Check if space exists
    const space = await Space.findById(space_id);
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Create new review
    const newReview = new Review({
      reviewer: user_id,
      reviewedSpace: space_id,
      rating,
      review,
      name,
      email
    });

    await newReview.save();

    // Update space's average rating
    const reviews = await Review.find({ reviewedSpace: space_id });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    await Space.findByIdAndUpdate(space_id, {
      $set: { averageRating: averageRating.toFixed(1) }
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

 // Get all reviews for a space
module.exports.getSpaceReviews = asyncHandler(async (req, res, next) => {
  
  try {
    const { space_id } = req.params;
    const reviews = await Review.find({ reviewedSpace: space_id })
      .populate('reviewer', 'name email') // Adjust fields based on your User model
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getSpaceReviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// Update a review
module.exports.updateReview = asyncHandler(async (req, res, next) => {

  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the user owns the review
    if (existingReview.reviewer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, review },
      { new: true, runValidators: true }
    );

    // Update space's average rating
    const space_id = existingReview.reviewedSpace;
    const reviews = await Review.find({ reviewedSpace: space_id });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    await Space.findByIdAndUpdate(space_id, {
      $set: { averageRating: averageRating.toFixed(1) }
    });

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// Delete a review
module.exports.deleteReview = asyncHandler(async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the user owns the review
    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const space_id = review.reviewedSpace;
    await Review.findByIdAndDelete(reviewId);

    // Update space's average rating
    const remainingReviews = await Review.find({ reviewedSpace: spaceId });
    const averageRating = remainingReviews.length > 0
      ? remainingReviews.reduce((acc, curr) => acc + curr.rating, 0) / remainingReviews.length
      : 0;

    await Space.findByIdAndUpdate(spaceId, {
      $set: { averageRating: averageRating.toFixed(1) }
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
});




