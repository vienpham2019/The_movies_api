"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  register,
  login,
  updateUserInfo,
  changePassword,
} = require("../controller/user.controller");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.patch("/update/:_id", asyncHandler(updateUserInfo));
router.patch("/changePassword/:_id", asyncHandler(changePassword));

module.exports = router;
