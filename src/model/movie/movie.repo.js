"use strict";

const movieModel = require("./movie.model");
const { getSelectData, getSkip } = require("../../util");

// Get
const getAllMoviesByQuery = async ({ query = {}, select = [] }) => {
  return await movieModel
    .find(query)
    .select(getSelectData(select))
    .lean()
    .exec();
};
const getAllMovies = async ({
  query,
  page,
  limit,
  sortBy,
  sortDir,
  select = [],
}) => {
  const result = await movieModel.aggregate([
    {
      $match: {
        ...query, // Apply the query to filter the movies
      },
    },
    {
      $facet: {
        genreCounts: [
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
        ],
        yearCounts: [
          {
            $bucket: {
              groupBy: {
                $year: "$release_date", // Extract the year from the release_date field
              },
              boundaries: [1920, 1951, 1981, 2011, 2019, 2100], // Define year range boundaries
              default: "Others",
              output: {
                count: { $sum: 1 }, // Count the number of movies in each year range
              },
            },
          },
          {
            $project: {
              yearRange: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1920] }, then: "1920-1950" },
                    { case: { $eq: ["$_id", 1951] }, then: "1951-1980" },
                    { case: { $eq: ["$_id", 1981] }, then: "1981-2010" },
                    { case: { $eq: ["$_id", 2011] }, then: "2011-2018" },
                    { case: { $eq: ["$_id", 2019] }, then: "2019+" },
                  ],
                  default: "Others",
                },
              },
              count: 1,
              _id: 0, // Exclude _id from the result
            },
          },
        ],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const movies = await movieModel
    .find({ ...query })
    .select(getSelectData(select))
    .sort({ [sortBy]: Math.floor(sortDir) })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();

  const genreCounts = result[0].genreCounts;
  const yearCounts = result[0].yearCounts;
  const totalMovies = result[0].totalCount[0]?.count || 0; // Default to 0 if no count is found

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
  getAllMoviesByQuery,
  findMovieById,
  getMovieRecommendations,
  createMovie,
};
