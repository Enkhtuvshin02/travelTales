import mongoose from "mongoose";
const storySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  duration: {
    type: String,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  otherFields: {
    type: mongoose.Schema.Types.Map,
    of: mongoose.Schema.Types.Mixed,
  },
  commentCount: {
    type: Number,
  },
  reviewCount: {
    type: Number,
  },
});

export default mongoose.model("Story", storySchema);
