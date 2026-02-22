import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: ""
  },
  secretCode: {
    type: String,
    required: true,
    minlength: 4
  },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true
  },
  availableAt: {
    type: Date,
    default: null
  },
  deleteAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model("Confession", confessionSchema);
