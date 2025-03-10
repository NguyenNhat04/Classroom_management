const SemesterService = require("../services/semester.service");
const { OK, CREATED } = require("../core/success.response");

class SemesterController {
  static async addSemester(req, res, next) {
    try {
      const result = await SemesterService.addSemester(req.body);
      return CREATED(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async getSemesterById(req, res, next) {
    try {
      const semester = await SemesterService.getSemesterById(
        req.params.semesterId
      );
      return OK(res, "Success", semester);
    } catch (error) {
      next(error);
    }
  }

  static async getAllSemesters(req, res, next) {
    try {
      const semesters = await SemesterService.getAllSemesters();
      return OK(res, "Success", semesters);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SemesterController;
