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

  const genreCounts = await movieModel.aggregate([
    {
      $match: {
        ...query, // Apply the query to filter the movies
      },
    },
    {
      $project: {
        // Split the genre string into an array
        genres: { $split: ["$genre", ", "] }, // Assuming genres are separated by ", "
      },
    },
    {
      $unwind: "$genres", // Unwind the array to create a document for each genre
    },
    {
      $match: {
        genres: { $ne: "N/A" }, // Exclude entries where genre is 'N/A'
      },
    },
    {
      $group: {
        _id: "$genres", // Group by each genre
        count: { $sum: 1 }, // Count the number of movies in each genre
      },
    },
    {
      $project: {
        genre: "$_id", // Rename _id to genre
        count: 1, // Keep the count
        _id: 0, // Exclude _id from the result
      },
    },
  ]);

  let yearCounts = {
    "1920-1950": await movieModel.countDocuments({
      release_date: {
        $gte: new Date(`1920-01-01`),
        $lte: new Date(`1950-12-31`),
      },
    }),
    "1951-1980": await movieModel.countDocuments({
      release_date: {
        $gte: new Date(`1951-01-01`),
        $lte: new Date(`1980-12-31`),
      },
    }),
    "1981-2010": await movieModel.countDocuments({
      release_date: {
        $gte: new Date(`1981-01-01`),
        $lte: new Date(`2010-12-31`),
      },
    }),
    "2011-2018": await movieModel.countDocuments({
      release_date: {
        $gte: new Date(`2011-01-01`),
        $lte: new Date(`2018-12-31`),
      },
    }),
    "2019+": await movieModel.countDocuments({
      release_date: {
        $gte: new Date(`2019-01-01`),
      },
    }),
  };

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
    genreCounts,
    yearCounts,
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
