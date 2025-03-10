const Semester = require("../models/semester.model");
const {
  ConflictRequestError,
  NotFoundError,
  BadRequestError,
} = require("../core/error.response");

class SemesterService {
  static async addSemester({ semester_name, semester_id }) {
    try {
      const newSemester = new Semester({ semester_name, semester_id });
      await newSemester.save();
      return { message: `Đã thêm kỳ học ${semester_id}: ${semester_name}` };
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictRequestError("Mã kỳ học đã tồn tại");
      }
      throw new BadRequestError(`Lỗi không xác định. Lỗi: ${e.toString()}`);
    }
  }

  static async getSemesterById(semester_id) {
    const semester = await Semester.findOne({ semester_id });
    if (!semester) {
      throw new NotFoundError("Mã kỳ học không tồn tại");
    }
    return semester;
  }

  static async getAllSemesters() {
    return await Semester.find({});
  }
}

module.exports = SemesterService;
