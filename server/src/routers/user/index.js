"use strict";

const { Router } = require("express");
const userRouter = Router();

const UserController = require("../../controllers/user.controller");
const { asyncHandler } = require("../helpers/async.handle");
const { validateToken } = require("../middlewares/auth.middleware");

// GET /profile/:profileId
userRouter.get(
  "profile/:profileId",
  validateToken,
  asyncHandler(UserController.getProfileById)
);

// POST /profile/:profileId/edit
userRouter.post(
  "/profile/:profileId/edit",
  validateToken,
  asyncHandler(UserController.editProfileById)
);

module.exports = userRouter;
