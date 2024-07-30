"use strict";

const movieModel = require("./movie.model");
const { getSelectData, getSkip } = require("../../util");

// Get
const getAllMovies = async ({
  query,
  page,
  limit,
  sortBy,
  sortDir,
  select = [],
}) => {
  const totalMovies = await movieModel.countDocuments({
    ...query,
  });

  const movies = await movieModel
    .find({ ...query })
    .select(getSelectData(select))
    .sort({ [sortBy]: Math.floor(sortDir) })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();

  return {
    totalMovies,
    movies,
  };
};

const findMovieById = async ({ _id }) => {
  return await movieModel.findById(_id).lean().exec();
};

const getMovieRecommendations = async ({ movie, limit, select }) => {
  return await movieModel.aggregate([
    {
      $match: {
        _id: { $ne: movie._id },
      },
    },
    { $sample: { size: +limit } },
    { $project: getSelectData(select) },
  ]);
};
// Create
const createMovie = async ({ payload }) => {
  return await movieModel.create(payload);
};

module.exports = {
  getAllMovies,
  findMovieById,
  getMovieRecommendations,
  createMovie,
};
