const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const { findMovieById } = require("../model/movie/movie.repo");
const {
  createReview,
  getAllReviewByMovieId,
} = require("../model/review/review.repo");
const { isValidEmail, convertToObjectIdMongoDB } = require("../util");

class ReviewService {
  static async getAllReviewByMovieId({ movieId, limit = 10, page = 1 }) {
    try {
      const foundMovie = await findMovieById({
        _id: convertToObjectIdMongoDB(movieId),
      });
      if (!foundMovie) {
        throw new BadRequestError("Movie not found");
      }
      return await getAllReviewByMovieId({
        movieId: foundMovie._id,
        limit,
        page,
        select: ["_id", "author", "date", "email", "score", "content"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async createReview({ movieId, author, date, email, content, score }) {
    try {
      if (
        !movieId ||
        !author ||
        !date ||
        !email ||
        !isValidEmail(email) ||
        !content ||
        !score ||
        score < 0 ||
        score > 10
      ) {
        throw new BadRequestError("All field allowed or invalid");
      }
      const foundMovie = await findMovieById({
        _id: convertToObjectIdMongoDB(movieId),
      });
      if (!foundMovie) {
        throw new BadRequestError("Movie not found");
      }
      return await createReview({
        payload: {
          movieId: foundMovie._id,
          author,
          date,
          email,
          content,
          score,
        },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = ReviewService;
