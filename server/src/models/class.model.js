const mongoose = require("mongoose"); //thư viện dùng để thao tác và kết nối với mongoDB
const Schema = mongoose.Schema; // định nghĩa cấu trúc (bảng) trong mongoDB
const ObjectId = Schema.ObjectId;
const ClassSchema = new Schema({
  class_id: {
    type: String,
    index: { unique: true },
    dropDups: true,
    required: true,
  },
  class_name: { type: String, required: true },
  class_teacher: {
    type: ObjectId,
    required: true,
    ref: Configs.DB_SCHEMA.USER, // tham chiếu đến bảng user
  },
  class_members: { type: [ObjectId], ref: Configs.DB_SCHEMA.USER, default: [] },
  feed_ref: { type: ObjectId, ref: Configs.DB_SCHEMA.FEED, default: null },
});
module.exports = ClassSchema;
