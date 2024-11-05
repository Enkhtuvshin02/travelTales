import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
  },
  preference: {
    type: [String],
  },
  profilePicUrl: {
    type: String,
  },
  loginName: {
    type: String,
  },
  password: {
    type: String,
  },
  followedUsers: {
    type: [String],
  },
  followers: {
    type: [String],
  },
});

export default mongoose.model("User", userSchema);
