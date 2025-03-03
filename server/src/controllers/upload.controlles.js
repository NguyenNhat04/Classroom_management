const { RES_FORM } = require("../../configs/Constants");
const { processUpload, processSubjects } = require("../services/uploadService");

async function handleUploadTeachers(req, res) {
    const result = await processUpload(req, "teacher");
    res.status(200).json(RES_FORM("Success", result));
}

async function handleUploadStudents(req, res) {
    const result = await processUpload(req, "student");
    res.status(200).json(RES_FORM("Success", result));
}

async function handleUploadSubjects(req, res) {
    const result = await processSubjects(req);
    res.status(200).json(RES_FORM("Success", result));
}

module.exports = { handleUploadTeachers, handleUploadStudents, handleUploadSubjects };