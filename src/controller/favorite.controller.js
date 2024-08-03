const { OK } = require("../core/success.response");
const FavoriteService = require("../service/favorite.service");

class FavoriteController {
  getAllFavorites = async (req, res, next) => {
    new OK({
      message: "Get all favorite successfully!",
      metadata: await FavoriteService.getAllFavorites({
        ...req.params,
        ...req.query,
      }),
    }).send(res);
  };
  findFavorite = async (req, res, next) => {
    new OK({
      message: "Get favorite successfully!",
      metadata: await FavoriteService.findFavorite(req.query),
    }).send(res);
  };

  createFavorite = async (req, res, next) => {
    new OK({
      message: "Create favorite successfully!",
      metadata: await FavoriteService.createFavorite(req.body),
    }).send(res);
  };

  deleteFavorite = async (req, res, next) => {
    new OK({
      message: "Delete favorite successfully!",
      metadata: await FavoriteService.deleteFavorite(req.query),
    }).send(res);
  };
}

module.exports = new FavoriteController();
