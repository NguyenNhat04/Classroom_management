"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api/user", require("./user/index"));

router.use("/v1/api", require("./access/index"));
router.use("/v1/upload", require("./upload/index"));

module.exports = router;
