const { OK } = require("../core/success.response");
const ReviewService = require("../service/review.service");

class ReviewController {
  getAllReviewByMovieId = async (req, res, next) => {
    new OK({
      message: "Get all review successfully!",
      metadata: await ReviewService.getAllReviewByMovieId({
        ...req.query,
        ...req.params,
      }),
    }).send(res);
  };
  createReview = async (req, res, next) => {
    new OK({
      message: "Create review successfully!",
      metadata: await ReviewService.createReview(req.body),
    }).send(res);
  };
}

module.exports = new ReviewController();
