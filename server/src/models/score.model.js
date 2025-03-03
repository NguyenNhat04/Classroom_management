const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  score: { type: Number, required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  semester_id: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
});

const ScoresTableSchema = new Schema({
  user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
  scores: [{ type: Schema.Types.ObjectId, ref: "Score" }],
  status: [{ type: String }],
});

module.exports = {
  Score: mongoose.model("Score", ScoreSchema),
  ScoresTable: mongoose.model("ScoresTable", ScoresTableSchema),
};
