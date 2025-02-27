"use strict";

const UserService = require("../services/user.service");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

// Giả định bạn có LoginInfo model để cập nhật password
const LoginInfo = require("../models/loginInfo.model");
const hash = require("sha256");

class UserController {
  /**
   * Lấy profile theo ID
   * - Nếu profileId = "me" => lấy user từ `req.senderInstance`
   * - Nếu không => gọi UserService.findUserByHUMGId(profileId)
   */
  getProfileById = async (req, res) => {
    const { profileId } = req.params;
    if (profileId === "me") {
      // Thông tin user đã được middleware validateToken gán
      const userDoc = req.senderInstance;
      return OK(res, "Success", userDoc);
    }
    // Lấy user từ DB
    const user = await UserService.findUserByHUMGId(profileId);
    return OK(res, "Success", user);
  };

  /**
   * Sửa profile
   * - Nếu có old_password, new_password => cập nhật password
   * - Nếu profileId = "me", update user instance => save
   * - Nếu không => update DB dựa trên humg_id
   */
  editProfileById = async (req, res) => {
    let { old_password, new_password } = req.body;
    let { profileId } = req.params;

    // Nếu có thay đổi password
    if (old_password && new_password) {
      const loginInfo = await LoginInfo.findOne({
        user_ref: req.senderInstance._id,
      });
      if (!loginInfo) {
        throw new BadRequestError("Không tìm thấy thông tin đăng nhập!");
      }
      await UserService.updateUserPassword(
        loginInfo,
        old_password,
        new_password
      );
    }

    // Nếu là "me"
    if (profileId === "me") {
      profileId = req.senderInstance.humg_id; // Tùy logic bạn
      req.senderInstance.set(req.body);
      const finalDoc = await req.senderInstance.save();
      return OK(res, "Success", finalDoc);
    }

    // Ngược lại => update DB theo humg_id
    const updatedUser = await UserService.updateUserByHUMGId(
      profileId,
      req.body
    );
    return OK(res, "Success", updatedUser);
  };
}

module.exports = new UserController();
