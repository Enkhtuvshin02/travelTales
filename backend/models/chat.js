import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  connectedUsers: {
    type: [String],
  },
  userUnreadMessages: {
    type: Object,
    default: {},
  },
});

export default mongoose.model("Chat", chatSchema);
