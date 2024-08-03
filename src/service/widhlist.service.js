"use strict";

const { InternalServerError } = require("../core/error.response");
const {
  findWidhlist,
  createWidhlist,
  deleteWidhlist,
} = require("../model/widhlist/widhlist.repo");
const { convertToObjectIdMongoDB } = require("../util");

class WidhlistService {
  static async findWidhlist({ userId, movieId }) {
    try {
      const foundWidhlist = await findWidhlist({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      return !!foundWidhlist;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async createWidhlist({ userId, movieId }) {
    try {
      const foundWidhlist = await findWidhlist({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      if (!foundWidhlist) {
        return await createWidhlist({
          userId: convertToObjectIdMongoDB(userId),
          movieId: convertToObjectIdMongoDB(movieId),
        });
      }
      return;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async deleteWidhlist({ userId, movieId }) {
    try {
      const foundWidhlist = await findWidhlist({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
      if (!foundWidhlist) {
        return;
      }
      return await deleteWidhlist({
        userId: convertToObjectIdMongoDB(userId),
        movieId: convertToObjectIdMongoDB(movieId),
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = WidhlistService;
