const ScoreService = require("../services/score.service");
const { OK, CREATED } = require("../core/success.response");

class ScoreController {
  static async getScoresByUserId(req, res, next) {
    try {
      const scores = await ScoreService.getScoresByUserId(req.params.userId);
      return OK(res, "Success", scores);
    } catch (error) {
      next(error);
    }
  }

  static async addScoreToUser(req, res, next) {
    try {
      const result = await ScoreService.addScoreToUser(req.body);
      return CREATED(res, result.message, result.data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScoreController;
sss;
