"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  findWidhlist,
  createWidhlist,
  deleteWidhlist,
  getAllWidhlists,
} = require("../controller/widhlist.controller");

router.get("/isSelect", asyncHandler(findWidhlist));
router.get("/all/:userId", asyncHandler(getAllWidhlists));
router.post("/new", asyncHandler(createWidhlist));
router.delete("/delete", asyncHandler(deleteWidhlist));

module.exports = router;
