const SubjectService = require("../services/subjectService");
const { CREATED } = require("../utils/successResponse");

class SubjectController {
    static async addSubject(req, res, next) {
        try {
            const result = await SubjectService.addSubject(req.body);
            return CREATED(res, result.message);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SubjectController;
