"use strict";

const {
  getAllMovies,
  createMovie,
  findMovieById,
  getMovieRecommendations,
} = require("../model/movie/movie.repo");
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const { convertToObjectIdMongoDB } = require("../util");
class MovieService {
  // Get
  static async getAllMovies({
    limit = 50,
    page = 1,
    sortBy = "updatedAt",
    sortDir = 1,
    searchByGenre = "",
    searchByYears = "",
    search = "",
  }) {
    let query = {};
    if (searchByGenre !== "") {
      query["genre"] = { $regex: new RegExp(searchByGenre, "i") };
    }
    if (search !== "") {
      query["title"] = { $regex: new RegExp(search, "i") };
    }

    if (searchByYears !== "") {
      const [startYear, endYear] = searchByYears.includes("+")
        ? [searchByYears.slice(0, -1), null]
        : searchByYears.split("-");
      console.log(startYear, endYear);
      if (endYear) {
        query["release_date"] = {
          $gte: new Date(`${startYear}-01-01`),
          $lte: new Date(`${endYear}-12-31`),
        };
      } else {
        query["release_date"] = {
          $gte: new Date(`${startYear}-01-01`),
        };
      }
    }

    try {
      return await getAllMovies({
        query,
        page,
        limit,
        sortBy,
        sortDir,
        select: [
          "_id",
          "release_date",
          "vote_average",
          "runtime",
          "genre",
          "title",
          "overview",
          "poster_path",
        ],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getMovieDetails({ _id }) {
    try {
      return await findMovieById({ _id: convertToObjectIdMongoDB(_id) });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getMovieRecommendations({ _id, limit = 10 }) {
    try {
      const foundMovie = await findMovieById({
        _id: convertToObjectIdMongoDB(_id),
      });
      if (!foundMovie) {
        throw new BadRequestError("Movie not found");
      }
      return await getMovieRecommendations({
        movie: foundMovie,
        limit,
        select: [
          "_id",
          "release_date",
          "vote_average",
          "runtime",
          "genre",
          "title",
          "overview",
          "poster_path",
        ],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Create
  static async createMovie({ payload }) {
    try {
      return createMovie({ payload });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = MovieService;
