// file: src/controllers/access.controller.js
"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.response");

class AccessController {
  /**
   * Đăng ký
   */
  signUp = async (req, res, next) => {
    // Gọi service signUp
    const result = await AccessService.signUp(req.body);
    // Trả response 201 Created
    CREATED(res, "Register Success!!!", result);
  };

  /**
   * Đăng nhập
   */
  login = async (req, res, next) => {
    const { username, password } = req.body;
    const result = await AccessService.login({ username, password });
    // 200 OK
    OK(res, "Logged In Success", result);
  };

  /**
   * Quên mật khẩu
   */
  forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    await AccessService.forgetPassword(email);
    // 200 OK
    OK(res, "Khôi phục mật khẩu thành công");
  };
}

module.exports = new AccessController();
