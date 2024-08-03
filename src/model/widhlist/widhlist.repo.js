"use strict";

const { getSkip } = require("../../util");
const widhlistModel = require("./widhlist.model");

// Get
const getWidhlists = async ({ limit, page, query = {} }) => {
  const totalWidhlists = await widhlistModel.countDocuments(query);

  const results = await widhlistModel.aggregate([
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
    totalWidhlists,
    widhlists: results,
  };
};
const findWidhlist = async ({ movieId, userId }) => {
  return widhlistModel.findOne({ movieId, userId });
};

const createWidhlist = async ({ movieId, userId }) => {
  return widhlistModel.create({ movieId, userId });
};

const deleteWidhlist = async ({ movieId, userId }) => {
  return widhlistModel.deleteOne({ movieId, userId });
};

module.exports = { getWidhlists, findWidhlist, createWidhlist, deleteWidhlist };
