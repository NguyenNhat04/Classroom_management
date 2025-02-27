// file: src/middlewares/validators/access.validator.js
"use strict";
const { body, validationResult } = require("express-validator");

exports.validateRegister = [
  body("humg_id").notEmpty().withMessage("humg_id is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  // ...
  (req, res, next) => {
    // kiểm tra lỗi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLoginRequest = [
  body("username").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
