import mongoose from "mongoose";
const photoSchema = new mongoose.Schema({
  storyId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Photo", photoSchema);
