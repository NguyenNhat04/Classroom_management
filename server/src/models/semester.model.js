const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const SemesterSchema = new Schema({
  semester_id: { type: String, required: true, unique: true, index: true },
  semester_name: { type: String, required: true },
  start_date: { type: Number, required: false, default: null },
  end_date: { type: Number, required: false, default: null },
});
module.exports = { SemesterSchema };
