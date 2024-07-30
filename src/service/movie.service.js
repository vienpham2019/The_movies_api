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
    search = "",
  }) {
    let query = {};
    if (searchByGenre !== "") {
      query["genre"] = { $regex: new RegExp(searchByGenre, "i") };
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
