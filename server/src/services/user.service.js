// file: src/services/user.service.js
"use strict";

const User = require("../models/user.model");
const hash = require("sha256");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class UserService {
  /**
   * Lấy thông tin user dựa trên HUMG ID
   * @param {string} humgId
   * @returns {Object} userDocument
   */
  static async findUserByHUMGId(humgId) {
    const user = await User.findOne({ humg_id: humgId }).lean();
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  /**
   * Cập nhật profile (đơn giản, update DB dựa trên humg_id)
   * @param {string} humgId
   * @param {Object} updateData
   * @returns {Object} userDocument sau khi update
   */
  static async updateUserByHUMGId(humgId, updateData) {
    const user = await User.findOneAndUpdate({ humg_id: humgId }, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  /**
   * Cập nhật password (ví dụ khi user thay đổi mật khẩu cũ => mới)
   * Tuỳ bạn lưu pass ở `LoginInfo` hoặc `User`.
   * Ví dụ code cũ:
   *  - Tìm `LoginInfo` bằng user_ref => so sánh old_password => update.
   */
  static async updateUserPassword(loginInfoModel, oldPassword, newPassword) {
    if (newPassword.length < 8) {
      throw new BadRequestError("Mật khẩu mới phải >= 8 ký tự");
    }
    if (hash(oldPassword) !== loginInfoModel.password) {
      throw new BadRequestError("Mật khẩu cũ không khớp!");
    }

    // Cập nhật pass
    loginInfoModel.password = hash(newPassword);
    await loginInfoModel.save();
    return true;
  }
}

module.exports = UserService;
