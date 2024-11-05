import mongoose from "mongoose";
const profilePicSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ProfilePic", profilePicSchema);
