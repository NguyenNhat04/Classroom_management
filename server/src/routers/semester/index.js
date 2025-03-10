const express = require("express");
const SemesterController = require("../controllers/semesterController");

const semesterRouter = express.Router();

semesterRouter.post("/add", SemesterController.addSemester);
semesterRouter.get("/:semesterId", SemesterController.getSemesterById);
semesterRouter.get("/", SemesterController.getAllSemesters);

module.exports = semesterRouter;
