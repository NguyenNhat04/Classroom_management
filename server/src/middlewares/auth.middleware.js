// file: src/middlewares/auth.middleware.js
"use strict";

const jwt = require("jsonwebtoken");
const Configs = require("../../configs/Constants");
const LoginInfo = require("../../models/loginInfo.model");
const { AuthFailureError } = require("../../core/error.response");

/**
 * validateToken
 * - Lấy token (từ cookie / header)
 * - Kiểm tra DB => gán thông tin user cho req
 */
exports.validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AuthFailureError("Token not found");
    }

    // Tìm LoginInfo => populate user_ref
    const instance = await LoginInfo.findOne({ current_token: token }).populate(
      "user_ref"
    );
    if (!instance || !instance.user_ref) {
      throw new AuthFailureError("Token invalid");
    }

    // Gán vào request
    req.authState = Configs.AUTH_STATE.AUTHORIZED;
    req.senderHUMGId = instance.user_ref.humg_id;
    req.isAdmin = instance.user_ref.role === "admin";
    req.senderInstance = instance.user_ref; // doc user

    return next();
  } catch (error) {
    next(error);
  }
};
