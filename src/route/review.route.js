"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  getAllReviewByMovieId,
  createReview,
} = require("../controller/review.controller");

router.get("/all/:movieId", asyncHandler(getAllReviewByMovieId));
router.post("/new", asyncHandler(createReview));

module.exports = router;
