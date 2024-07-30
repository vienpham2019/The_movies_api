"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  getAllMovies,
  getMovieDetails,
  getRecommendations,
} = require("../controller/movies.controller");

router.get("/all", asyncHandler(getAllMovies));
router.get("/details/:_id", asyncHandler(getMovieDetails));
router.get("/recommendations/:_id", asyncHandler(getRecommendations));

module.exports = router;
