import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  storyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);
