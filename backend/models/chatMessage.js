import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date, 
    default: Date.now,
  },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
