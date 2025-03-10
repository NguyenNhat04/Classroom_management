const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { NotFoundError, BadRequestError } = require("../core/error.response");

class ChatService {
  static async getRecentChats(userId) {
    const chatRooms = await Chat.find({
      membersID: { $all: [userId] },
    }).populate("messages");
    return chatRooms;
  }

  static async getMessagesByVNUId(senderId, otherVNUId) {
    const otherUser = await User.findOne({ vnu_id: otherVNUId });
    if (!otherUser) {
      throw new NotFoundError("Không tìm thấy đối tượng cần xem tin nhắn");
    }

    const chatRoom = await Chat.findOne({
      membersID: { $size: 2, $all: [senderId, otherUser._id] },
    }).populate({
      path: "messages",
      populate: { path: "from to" },
    });

    return chatRoom ? chatRoom.messages : [];
  }

  static async getRecentContacts(userId) {
    const chatRooms = await Chat.find({
      membersID: { $size: 2, $all: [userId] },
    }).populate("membersID");

    const contacts = [];
    for (const chat of chatRooms) {
      let latestMessage = {};
      let latestSender = "";

      if (chat.messages.length > 0) {
        latestMessage = await Message.findById(
          chat.messages[chat.messages.length - 1]
        );
        latestSender =
          latestMessage.from.toString() === userId.toString()
            ? "isMe"
            : "notMe";
      }

      const contactUser = chat.membersID.find(
        (member) => member._id.toString() !== userId.toString()
      );
      contacts.push({
        contact: contactUser,
        latest_message: latestMessage,
        latest_sender: latestSender,
      });
    }

    return contacts;
  }
}

module.exports = ChatService;
