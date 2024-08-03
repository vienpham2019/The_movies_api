"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  findFavorite,
  createFavorite,
  deleteFavorite,
  getAllFavorites,
} = require("../model/favorite/favorites.repo");
const { getAllMoviesByQuery } = require("../model/movie/movie.repo");
const { getUserById } = require("../model/user/user.repo");
const { convertToObjectIdMongoDB } = require("../util");

class FavoriteService {
  static async getAllFavorites({ page = 1, limit = 10, search = "", userId }) {
    try {
      if (!userId) {
        throw new BadRequestError("User not found");
      }
      const foundUser = await getUserById({
        _id: convertToObjectIdMongoDB(userId),
        select: ["_id"],
      });
      if (!foundUser) {
        throw new BadRequestError("User not found");
      }

      const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching

      const movieIds = await getAllMoviesByQuery({
        query: { title: { $regex: regex } },
        select: ["_id"],
      });

      const query = {
        movieId: { $in: movieIds.map(({ _id }) => _id) },
        userId: foundUser._id,
      };
      return await getAllFavorites({ page, limit, query });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async findFavorite({ userId, movieId }) {
    try {
      const foundFavorite = await findFavorite({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      return !!foundFavorite;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async createFavorite({ userId, movieId }) {
    try {
      const foundFavorite = await findFavorite({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      if (!foundFavorite) {
        return await createFavorite({
          userId: convertToObjectIdMongoDB(userId),
          movieId: convertToObjectIdMongoDB(movieId),
        });
      }
      return;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async deleteFavorite({ userId, movieId }) {
    try {
      const foundFavorite = await findFavorite({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      if (!foundFavorite) {
        return;
      }
      return await deleteFavorite({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = FavoriteService;
