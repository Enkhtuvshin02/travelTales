import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  storyId: {
    type: String,
    required: true,
  },
  fiveOutta: {
    type: Number,
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

export default mongoose.model("Review", reviewSchema);
