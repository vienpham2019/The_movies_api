"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  findFavorite,
  createFavorite,
  deleteFavorite,
  getAllFavorites,
} = require("../controller/favorite.controller");

router.get("/isSelect", asyncHandler(findFavorite));
router.get("/all/:userId", asyncHandler(getAllFavorites));
router.post("/new", asyncHandler(createFavorite));
router.delete("/delete", asyncHandler(deleteFavorite));

module.exports = router;
