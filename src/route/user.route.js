"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  register,
  login,
  updateUserInfo,
} = require("../controller/user.controller");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.patch("/update/:_id", asyncHandler(updateUserInfo));

module.exports = router;
