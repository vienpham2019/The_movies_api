"use strict";

const { getSkip } = require("../../util");
const favoritesModel = require("./favorites.model");

// Get
const getAllFavorites = async ({ limit, page, query = {} }) => {
  const totalFavorites = await favoritesModel.countDocuments(query);

  const results = await favoritesModel.aggregate([
    {
      $match: { ...query },
    },
    {
      $lookup: {
        from: "Movies", // Name of the movie collection
        localField: "movieId",
        foreignField: "_id",
        as: "movieDetails",
      },
    },
    {
      $unwind: "$movieDetails",
    },
    {
      $project: {
        _id: 1,
        "movieDetails.release_date": 1,
        "movieDetails.vote_average": 1,
        "movieDetails.runtime": 1,
        "movieDetails.genre": 1,
        "movieDetails.title": 1,
        "movieDetails.overview": 1,
        "movieDetails.poster_path": 1,
      },
    },
    {
      $skip: getSkip({ page, limit }),
    },
    {
      $limit: +limit,
    },
  ]);

  return {
    totalFavorites,
    favorites: results,
  };
};
const findFavorite = async ({ movieId, userId }) => {
  return favoritesModel.findOne({ movieId, userId });
};

const createFavorite = async ({ movieId, userId }) => {
  return favoritesModel.create({ movieId, userId });
};

const deleteFavorite = async ({ movieId, userId }) => {
  return favoritesModel.deleteOne({ movieId, userId });
};

module.exports = {
  getAllFavorites,
  findFavorite,
  createFavorite,
  deleteFavorite,
};
