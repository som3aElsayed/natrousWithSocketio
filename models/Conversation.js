const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema({
  members: {
    type: Array,
    validate: {
      validator: function ([...value]) {
        console.log(value);
        return !(value.length !== 2);
      },
      message: (props) => `${props.value} exceeds maximum array 2`,
    },
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
