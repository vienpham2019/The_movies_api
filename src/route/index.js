"use strict";

const express = require("express");
const router = express.Router();

router.use("/movie", require("./movie.route"));
router.use("/review", require("./review.route"));
router.use("/user", require("./user.route"));

module.exports = router;
