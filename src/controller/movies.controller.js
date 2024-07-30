const MovieService = require("../service/movie.service");
const { OK } = require("../core/success.response");

class MovieController {
  getAllMovies = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getAllMovies(req.query),
    }).send(res);
  };

  getMovieDetails = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getMovieDetails(req.params),
    }).send(res);
  };

  getRecommendations = async (req, res, next) => {
    new OK({
      message: "Get movie recommendations successfully!",
      metadata: await MovieService.getMovieRecommendations({
        ...req.query,
        ...req.params,
      }),
    }).send(res);
  };
}

module.exports = new MovieController();
