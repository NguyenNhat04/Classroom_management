const express = require("express");
const { handleUploadTeachers, handleUploadStudents, handleUploadSubjects } = require("../controllers/uploadController");
const { handleUploadFile } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload/teachers", handleUploadFile, handleUploadTeachers);
router.post("/upload/students", handleUploadFile, handleUploadStudents);
router.post("/upload/subjects", handleUploadFile, handleUploadSubjects);

module.exports = router;