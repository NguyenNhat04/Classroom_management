const { Score, ScoresTable } = require("../models/score.model");
const User = require("../models/user");
const Subject = require("../models/subject");
const Semester = require("../models/semester");

const { OK, CREATED } = require("../core/success.response");
const { NotFoundError, BadRequestError } = require("../core/error.response");

class ScoreService {
  static async getScoresByUserId(userId, res) {
    const scores = await ScoresTable.findOne({ user_ref: userId })
      .populate({
        path: "scores",
        populate: { path: "subject" },
      })
      .populate("user_ref");

    return OK(res, "Success", scores || []);
  }

  static async addScoreByUser({ humg_id, subject_code, score, semester_id }) {
    const user = await User.findOne({ humg_id });
    const subject = await Subject.findOne({ subject_code });
    const semester = await Semester.findOne({ semester_id });

    if (!user) throw new NotFoundError(`Không tìm được VNU-ID: ${humg_id}`);
    if (!subject)
      throw new NotFoundError(`Không tìm thấy môn học: ${subject_code}`);
    if (!semester)
      throw new NotFoundError(`Không tìm thấy kỳ học: ${semester_id}`);

    let scoreTable = await ScoresTable.findOne({ user_ref: user._id });

    if (!scoreTable) {
      scoreTable = new ScoresTable({ user_ref: user._id, scores: [] });
      await scoreTable.save();
    }

    const existingScore = scoreTable.scores.some(
      (s) => s.subject.toString() === subject._id.toString()
    );
    if (existingScore)
      throw new BadRequestError("Điểm cho môn học này đã tồn tại");

    const newScore = new Score({
      score,
      subject: subject._id,
      semester_id: semester._id,
    });
    await newScore.save();

    scoreTable.scores.push(newScore);
    await scoreTable.save();

    return {
      message: `Đã thêm điểm ${score} cho môn ${subject_code}`,
      data: newScore,
    };
  }
}

module.exports = ScoreService;
