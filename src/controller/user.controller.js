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
      metadata: await UserService.updateUserInfo({
        payload: req.body,
        ...req.params,
      }),
    }).send(res);
  };

  changePassword = async (req, res, next) => {
    new OK({
      message: "Change Password successfully!",
      metadata: await UserService.changePassword({
        payload: req.body,
        ...req.params,
      }),
    }).send(res);
  };
}

module.exports = new UserController();
