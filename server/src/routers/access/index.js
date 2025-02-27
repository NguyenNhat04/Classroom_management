// file: src/routes/access.route.js
"use strict";

const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/async.handle");
//  'validateRegister', 'validateLoginRequest'
// =>  file middlewares/validators/access.validator.js

// Đăng ký (Shops)
router.post(
  "/register",
  // validateRegister,
  asyncHandler(accessController.signUp)
);

// Đăng nhập
router.post("/login", asyncHandler(accessController.login));

// Quên mật khẩu
router.post("/forget-password", asyncHandler(accessController.forgetPassword));

module.exports = router;
