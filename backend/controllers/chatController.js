import Chat from "../models/chat.js";
import ChatMessage from "../models/chatMessage.js";

const getChat = async (sender, receiver) => {
  try {
    const chat = await Chat.findOne({
      connectedUsers: { $all: [sender, receiver] },
    });

    if (chat) {
      return chat;
    } else {
      // Use computed property names to create dynamic fields
      const newChat = new Chat({
        connectedUsers: [sender, receiver],
        userUnreadMessages: {
          [sender]: 0, // Dynamic field for sender
          [receiver]: 0, // Dynamic field for receiver
        },
      });

      await newChat.save();
      console.log(newChat);
      return newChat; // Ensure the new chat ID is returned
    }
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error("Server error: " + error.message);
  }
};

const createChatMessage = async (chatId, sender, message) => {
  try {
    const newChatMessage = new ChatMessage({
      chatId,
      senderId: sender,
      message: message,
    });
    console.log(newChatMessage);
    await newChatMessage.save();
    return "success";
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw new Error("Server error: " + error.message);
  }
};
const getChatMessages = async (req, res) => {
  const { chatId, userId } = req.params;
  console.log("Received request for chatId:", chatId);
  try {
    const chat = await Chat.findOne({ _id: chatId }).lean();

    if (!chat) {
      console.log("No chat found for chatId:", chatId);
      return res
        .status(404)
        .json({ message: "No chat found for this chatId." });
    }
    const otherUserId = chat.connectedUsers.find((id) => id !== userId);
    const chatMessages = await ChatMessage.find({ chatId }).lean();
    if (chatMessages.length === 0) {
      console.log("No chat messages found for chatId:", chatId);
      return res.status(200).json({
        chatId,
        userId: otherUserId,
        chatMessages: [],
        userUnreadMessages: chat.userUnreadMessages,
      });
    }

    const extractedChatMessages = chatMessages.map((message) => ({
      sender: message.senderId,
      message: message.message,
      time: message.time,
    }));

    console.log("Sending chat messages response for chatId:", chatId);
    res.status(200).json({
      chatId,
      userId: otherUserId,
      chatMessages: extractedChatMessages,
      userUnreadMessages: chat.userUnreadMessages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const chatRead = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  console.log("Received request for chatId:", chatId, "userId:", userId);

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $set: { [`userUnreadMessages.${userId}`]: 0 } },
      { new: true }
    ).lean();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat marked as read", chat });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default { getChat, createChatMessage, getChatMessages, chatRead };
