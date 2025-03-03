const express = require("express");
const ScoreController = require("../../controllers/score.controller");

const scoreRouter = express.Router();

scoreRouter.get("/:userId", ScoreController.getScoresByUserId);
scoreRouter.post("/add", ScoreController.addScoreToUser);

module.exports = scoreRouter;
