const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  conversationId: {
    type: String,
    require: [true, "You should add a convesation Id"],
  },
  message: {
    type: Array,
    required: [true, "You Should add a Messages"],
  },
});

module.exports = mongoose.model("Messages", messageSchema);
