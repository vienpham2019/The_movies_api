const { OK } = require("../core/success.response");
const WidhlistService = require("../service/widhlist.service");

class WidhlistController {
  getAllWidhlists = async (req, res, next) => {
    new OK({
      message: "Get all widhlist successfully!",
      metadata: await WidhlistService.getAllWidhlists({
        ...req.params,
        ...req.query,
      }),
    }).send(res);
  };
  findWidhlist = async (req, res, next) => {
    new OK({
      message: "Get Widhlist successfully!",
      metadata: await WidhlistService.findWidhlist(req.query),
    }).send(res);
  };

  createWidhlist = async (req, res, next) => {
    new OK({
      message: "Create Widhlist successfully!",
      metadata: await WidhlistService.createWidhlist(req.body),
    }).send(res);
  };

  deleteWidhlist = async (req, res, next) => {
    new OK({
      message: "Delete Widhlist successfully!",
      metadata: await WidhlistService.deleteWidhlist(req.query),
    }).send(res);
  };
}

module.exports = new WidhlistController();
