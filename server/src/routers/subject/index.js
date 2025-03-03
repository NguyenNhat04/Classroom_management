const express = require("express");
const SubjectController = require("../../controllers/subject.controller");

const subjectRouter = express.Router();

subjectRouter.post("/add", SubjectController.addSubject);

module.exports = subjectRouter;
