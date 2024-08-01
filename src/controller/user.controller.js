"use strict";

const UserService = require("../service/user.service");
const { OK } = require("../core/success.response");

class UserController {
  login = async (req, res, next) => {
    new OK({
      message: "Login successfully!",
      metadata: await UserService.login(req.body),
    }).send(res);
  };

  register = async (req, res, next) => {
    new OK({
      message: "Register successfully!",
      metadata: await UserService.register(req.body),
    }).send(res);
  };

  updateUserInfo = async (req, res, next) => {
    new OK({
      message: "Update User info successfully!",
      metadata: await UserService.updateUserInfo({ ...req.body, ...req.query }),
    }).send(res);
  };
}

module.exports = new UserController();
