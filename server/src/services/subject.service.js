const Subject = require("../models/subject.model");
const { ConflictRequestError, BadRequestError } = require("../core/error.response");

class SubjectService {
    static async addSubject({ subject_name, subject_code, credits_number }) {
        try {
            const newSubject = new Subject({ subject_name, subject_code, credits_number });
            await newSubject.save();
            return { message: `Added ${subject_code} -> ${subject_name} -> ${credits_number}` };
        } catch (e) {
            if (e.code === 11000) {
                throw new ConflictRequestError("Subject code or subject name already exists");
            }
            throw new BadRequestError(`Unknown error. Maybe required field not found. Error: ${e.toString()}`);
        }
    }
}

module.exports = SubjectService;