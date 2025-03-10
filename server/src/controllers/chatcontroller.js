const ChatService = require("../services/chat.service");
const { OK } = require("../core/success.response");

class ChatController {
  static async getRecentChats(req, res, next) {
    try {
      const chats = await ChatService.getRecentChats(req.senderInstance._id);
      return OK(res, "Success", chats);
    } catch (error) {
      next(error);
    }
  }

  static async getMessagesByVNUId(req, res, next) {
    try {
      const messages = await ChatService.getMessagesByVNUId(
        req.senderInstance._id,
        req.params.otherVNUId
      );
      return OK(res, "Success", messages);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentContacts(req, res, next) {
    try {
      const contacts = await ChatService.getRecentContacts(
        req.senderInstance._id
      );
      return OK(res, "Success", contacts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatController;
