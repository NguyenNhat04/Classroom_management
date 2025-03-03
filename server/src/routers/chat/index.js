const express = require("express");
const ChatController = require("../../controllers/chatcontroller");
const { validateToken } = require("../middlewares/authMiddleware");

const chatRouter = express.Router();

chatRouter.get("/recent-chats", validateToken, ChatController.getRecentChats);
chatRouter.get(
  "/messages/:otherVNUId",
  validateToken,
  ChatController.getMessagesByVNUId
);
chatRouter.get(
  "/recent-contacts",
  validateToken,
  ChatController.getRecentContacts
);

module.exports = chatRouter;
