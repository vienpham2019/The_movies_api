"use strict";

const express = require("express");
const router = express.Router();

router.use("/movie", require("./movie.route"));

module.exports = router;
