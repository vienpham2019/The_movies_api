"use strict";

const { getSelectData, getSkip } = require("../../util");
const reviewModel = require("./review.model");
// Get
const getAllReviewByMovieId = async ({ movieId, limit, page, select }) => {
  const tasts = await reviewModel.aggregate([
    {
      $match: {
        movieId, // Filter reviews by movieId
      },
    },
    {
      $group: {
        _id: null, // Group all matching documents
        totalReviews: { $sum: 1 }, // Count total reviews
        totalScore: { $sum: "$score" }, // Sum of all review scores
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the result
        totalReviews: 1,
        totalScore: 1,
      },
    },
  ]);
  const reviews = await reviewModel
    .find({ movieId })
    .sort({ updated_at: -1 })
    .select(getSelectData(select))
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();
  let totalReviews = 0;
  let totalScore = 0;
  if (tasts[0]) {
    totalReviews = tasts[0].totalReviews;
    totalScore = tasts[0].totalScore;
  }
  return {
    totalReviews,
    totalScore,
    reviews,
  };
};
// Create
const createReview = async ({ payload }) => {
  return await reviewModel.create(payload);
};

module.exports = {
  getAllReviewByMovieId,
  createReview,
};
