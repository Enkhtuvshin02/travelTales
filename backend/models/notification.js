import mongoose from "mongoose";
const notifSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  time: {
    Type: Date,
    required: true,
  },
});

export default mongoose.model("Notif", notifSchema);
