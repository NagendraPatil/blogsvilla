const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  disliles: { type: Number, default: 0 },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Comment = new model("Comment", CommentSchema);

module.exports = { Comment };
