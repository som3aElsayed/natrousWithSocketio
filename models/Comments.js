const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: [true, "You Should add a Comment"],
  },
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "a User Must belong to A tour"],
    },
  ],
});
module.exports = mongoose.model("comment", commentSchema);
