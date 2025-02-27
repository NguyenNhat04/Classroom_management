// file: src/services/access.service.js
"use strict";

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const hash = require("sha256");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// Import model (nếu bạn sử dụng mongoose Model riêng thay vì global.DBConnection)
const User = require("../models/user.model");
const LoginInfo = require("../models/loginInfo.model");

// Import các class error/ success response (nếu bạn dùng)
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const { OK, CREATED } = require("../core/success.response");

// Import file config
const Configs = require("../configs/Constants");

class AccessService {
  /**
   * Đăng ký user mới
   * Logic cũ: kiểm tra humg_id (hoặc vnu_id), tạo user => tạo login info => trả token
   */
  signUp = async (payload) => {
    // Kiểm tra trùng humg_id
    const {
      humg_id,
      name,
      gender,
      phone_number,
      role,
      email,
      location,
      dateOfBirth,
      password,
    } = payload;

    const dupUser = await User.findOne({ humg_id });
    if (dupUser) {
      // 409 Conflict
      throw new ConflictRequestError("HUMG-ID đã được đăng ký bởi người khác");
    }

    // Tạo user mới
    let newUser = new User({
      humg_id: humg_id ? humg_id : uuidv4(),
      name,
      gender,
      phone_number,
      role,
      email,
      location,
      date_of_birth: dateOfBirth,
    });
    newUser = await newUser.save();

    // Tạo token
    const newToken = jwt.sign(
      {
        humg_id: newUser.humg_id,
        createdDate: new Date().getTime(),
      },
      Configs.SECRET_KEY,
      { expiresIn: 3600 }
    );

    // Tạo LoginInfo
    const loginInfo = new LoginInfo({
      user_ref: newUser._id,
      password, // schema có set: hash => sẽ tự hash
      current_token: newToken,
      current_socket_id: null,
    });
    await loginInfo.save();

    return {
      user: {
        _id: newUser._id,
        humg_id: newUser.humg_id,
        email: newUser.email,
      },
      token: newToken,
    };
  };

  /**
   * Đăng nhập
   * Logic cũ: tìm user theo humg_id, kiểm tra password => tạo token => lưu
   */
  login = async ({ username, password }) => {
    // Tìm user theo humg_id = username
    const userRef = await User.findOne({ humg_id: username });
    if (!userRef) {
      throw new BadRequestError("Username hoặc Password chưa đúng");
    }

    // Tìm LoginInfo tương ứng, so sánh password
    // do schema đang set password = hash => cần so sánh chuỗi đã hash
    const loginInfo = await LoginInfo.findOne({
      user_ref: userRef._id,
      password: hash(password),
    });

    if (!loginInfo) {
      throw new BadRequestError("Username hoặc Password chưa đúng");
    }

    // Tạo token mới
    const newToken = jwt.sign(
      {
        id: loginInfo.user_ref.toString(),
        createdDate: new Date().getTime(),
      },
      Configs.SECRET_KEY,
      { expiresIn: "2 days" }
    );
    loginInfo.current_token = newToken;
    await loginInfo.save();

    return {
      token: newToken,
    };
  };

  /**
   * Quên mật khẩu
   * Logic cũ: tìm user theo email => random pass => gửi mail => cập nhật password
   */
  forgetPassword = async (email) => {
    // Tìm user
    const email_owner = await User.findOne({ email });
    if (!email_owner) {
      throw new NotFoundError("Email không tồn tại trong hệ thống");
    }

    // random password
    const newPassword = uuidv4();

    // update LoginInfo
    const temp = await LoginInfo.findOneAndUpdate(
      { user_ref: email_owner._id },
      { password: newPassword }, // schema sẽ hash
      { new: true }
    );
    if (!temp) {
      throw new BadRequestError("Có lỗi xảy ra khi cập nhật mật khẩu");
    }

    // Gửi mail
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "usser",
          pass: "12343554",
        },
      })
    );

    const mailOptions = {
      from: "vakoyomi@gmail.com",
      to: email,
      subject: "Website cố vấn học tập",
      text: `Password mới của bạn là: ${newPassword}`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  };
}

module.exports = new AccessService();
