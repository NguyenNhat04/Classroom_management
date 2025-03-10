const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ChatSchema = new Schema({
  memberID: [
    {
      type: ObjectId,
      ref: Configs.DB_SCHEMA.USER,
      index: true, //tối ưu tìm kiếm khi truy vấn dữ liệu
    },
  ],
  messages: [
    {
      type: ObjectId,
      ref: Configs.DB_SCHEMA.MESSAGE,
    },
  ],
});
const MessagesSchema = new Schema({
  from: { type: ObjectId, ref: Configs.DB_SCHEMA.USER, required: true },
  to: { type: ObjectId, ref: Configs.DB_SCHEMA.USER, required: true },
  message: { type: String, default: "" },
  createdDate: { type: Number, required: true },
  //required: true -> thông tin bắt bược phải có
});

module.exports = { ChatSchema, MessagesSchema };
